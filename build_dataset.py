#!/usr/bin/env python3
"""
build_dataset.py
Extracts words from vocab_mountain.json, computes dense embeddings using BAAI/bge-small-en-v1.5,
performs strict semantic clustering with high similarity thresholds into tight synonym brackets
and a dedicated Miscellaneous (Outliers & Unique Terms) bucket, generates 2D coordinates via t-SNE,
calculates top nearest neighbors for each word, and outputs web/data.json and web/data.js.
"""

import os
import json
import re
import colorsys
from collections import Counter
from bs4 import BeautifulSoup
import numpy as np
from sklearn.manifold import TSNE
from scipy.cluster.hierarchy import linkage, fcluster
from scipy.spatial.distance import squareform
from fastembed import TextEmbedding

def clean_description_html(raw_html):
    """Clean and sanitize the HTML for display in the interactive popup."""
    if not raw_html:
        return ""
    soup = BeautifulSoup(raw_html, "html.parser")
    
    # Remove google translate extension artifacts
    for div in soup.find_all(id=lambda x: x and "gtx" in str(x).lower()):
        div.decompose()
    for div in soup.find_all(class_=lambda x: x and "gtx" in str(x).lower()):
        div.decompose()
        
    # Strip inline font-size to let responsive CSS style it cleanly
    for tag in soup.find_all(True):
        if tag.has_attr("style"):
            style = tag["style"]
            # Remove font-size
            style = re.sub(r"font-size\s*:\s*[^;]+;?", "", style, flags=re.IGNORECASE).strip()
            # Remove empty style
            if style:
                tag["style"] = style
            else:
                del tag["style"]
                
    # Remove empty <p>&nbsp;</p> at end
    html_str = str(soup)
    html_str = re.sub(r"<p>\s*(&nbsp;|\s)*\s*</p>", "", html_str).strip()
    return html_str

def extract_word_features(w, group_title, group_idx):
    word_title = w["title"].strip()
    raw_html = w.get("description", "")
    soup = BeautifulSoup(raw_html, "html.parser")
    
    # Extract parts of speech
    pos_list = []
    for tag in soup.find_all(["strong", "b"]):
        txt = tag.get_text().strip().lower().rstrip(":")
        if txt in ["verb", "noun", "adjective", "adverb"]:
            if txt not in pos_list:
                pos_list.append(txt)
                
    # Extract synonyms
    synonyms = []
    syn_lis = set()
    for elem in soup.find_all(lambda tag: "synonym" in tag.get_text().lower() and len(tag.get_text().strip()) < 25):
        next_list = elem.find_next(["ul", "ol"])
        if next_list:
            for li in next_list.find_all("li"):
                syn_lis.add(li)
                clean_s = li.get_text().strip()
                if clean_s and clean_s not in synonyms:
                    synonyms.append(clean_s)
                    
    # Extract definitions (li elements not in synonyms)
    definitions = []
    for li in soup.find_all("li"):
        if li not in syn_lis:
            clean_def = li.get_text().strip()
            if clean_def and clean_def not in definitions:
                definitions.append(clean_def)
                
    # Clean HTML
    clean_html = clean_description_html(raw_html)
    
    pos_str = ", ".join(pos_list) if pos_list else "term"
    def_str = "; ".join(definitions) if definitions else ""
    syn_str = ", ".join(synonyms) if synonyms else ""
    
    # Prompt for dense semantic embedding
    embed_prompt = f"{word_title} ({pos_str}): {def_str}. Synonyms: {syn_str}."
    
    return {
        "word": word_title,
        "slug": w["slug"],
        "group": group_title,
        "group_num": group_idx + 1,
        "pronunciation": w.get("pronunciation", ""),
        "description": clean_html,
        "pos": pos_list,
        "definitions": definitions,
        "synonyms": synonyms,
        "embed_prompt": embed_prompt
    }

def generate_palette(n_clusters):
    """Generate vibrant, high-contrast HSL colors using golden ratio hue distribution."""
    colors = []
    for i in range(n_clusters):
        hue = (i * 0.618033988749895) % 1.0
        lightness = 0.54 if (i % 2 == 0) else 0.62
        saturation = 0.85
        r, g, b = colorsys.hls_to_rgb(hue, lightness, saturation)
        colors.append(f"#{int(r * 255):02X}{int(g * 255):02X}{int(b * 255):02X}")
    return colors

def main():
    print("Loading vocab_mountain.json...")
    with open("vocab_mountain.json", "r", encoding="utf-8") as f:
        raw_data = json.load(f)
        
    words = []
    prompts = []
    for g_idx, g in enumerate(raw_data):
        group_title = g.get("title", f"Group {g_idx+1}")
        for w in g.get("mountain_contents", []):
            item = extract_word_features(w, group_title, g_idx)
            item["id"] = len(words)
            words.append(item)
            prompts.append(item["embed_prompt"])
            
    total_words = len(words)
    print(f"Loaded {total_words} words.")
    
    # Check if cached embeddings exist to accelerate regeneration
    if os.path.exists("scratch_embs.npy"):
        print("Loading cached dense embeddings from scratch_embs.npy...")
        norm_embs = np.load("scratch_embs.npy")
    else:
        print("Generating dense embeddings via BAAI/bge-small-en-v1.5...")
        embed_model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")
        embeddings = np.array(list(embed_model.embed(prompts)))
        norms = np.linalg.norm(embeddings, axis=1, keepdims=True)
        norm_embs = embeddings / (norms + 1e-10)
        np.save("scratch_embs.npy", norm_embs)
        
    print(f"Normalized embeddings ready: {norm_embs.shape}")
    
    # 1. Base cosine similarity matrix
    print("Computing synonym-enhanced semantic similarity matrix...")
    sim_matrix = np.dot(norm_embs, norm_embs.T)
    
    # 2. Ground-truth synonym enhancements
    for i in range(total_words):
        w1_name = words[i]["word"].lower()
        w1_syns = set(s.lower() for s in words[i]["synonyms"])
        for j in range(i + 1, total_words):
            w2_name = words[j]["word"].lower()
            w2_syns = set(s.lower() for s in words[j]["synonyms"])
            is_direct = (w2_name in w1_syns or w1_name in w2_syns)
            shared_count = len(w1_syns.intersection(w2_syns))
            bonus = 0.0
            if is_direct:
                bonus += 0.08
            if shared_count > 0:
                bonus += min(0.06, 0.03 * shared_count)
            if bonus > 0:
                sim_matrix[i, j] = min(1.0, sim_matrix[i, j] + bonus)
                sim_matrix[j, i] = sim_matrix[i, j]
                
    # 3. Calculate top nearest neighbors for each word
    print("Calculating top 6 nearest neighbors...")
    for i in range(total_words):
        sim_scores = sim_matrix[i].copy()
        sim_scores[i] = -1.0  # exclude self
        top_indices = np.argsort(-sim_scores)[:6]
        neighbors = []
        for idx in top_indices:
            neighbors.append({
                "id": int(idx),
                "word": words[idx]["word"],
                "score": round(float(sim_scores[idx]), 3),
                "group": words[idx]["group"]
            })
        words[i]["nearest_neighbors"] = neighbors

    # 4. Strict Semantic Clustering with High Similarity Threshold
    # Using Average Linkage with strict distance threshold (t=0.24, intra-cluster similarity >= 0.76)
    # Allows tight synonym brackets (pairs, triplets, and families) up to 299 regular groups + 1 Miscellaneous
    print("Performing strict average-linkage hierarchical clustering with outlier detection...")
    dist = np.clip(1.0 - sim_matrix, 0, 1)
    condensed_dist = squareform(dist, checks=False)
    Z = linkage(condensed_dist, method="average")
    
    # Distance threshold 0.24 ensures average similarity across cluster members is >= 0.76
    raw_labels = fcluster(Z, t=0.24, criterion="distance")
    
    from collections import defaultdict
    cmap = defaultdict(list)
    for idx, l in enumerate(raw_labels):
        cmap[l].append(idx)
        
    # All cohesive clusters with at least 2 words
    candidates = [list(m) for m in cmap.values() if len(m) >= 2]
    
    # Prioritize larger clusters, then higher intra-cluster average similarity
    def score_cluster(m):
        sub = sim_matrix[np.ix_(m, m)].copy()
        np.fill_diagonal(sub, np.nan)
        avg_s = np.nanmean(sub)
        return (len(m), len(m) * avg_s)
        
    candidates.sort(key=score_cluster, reverse=True)
    
    # Cap regular clusters at 299 so total clusters with Miscellaneous is at most 300
    MAX_REGULAR_CLUSTERS = 299
    surviving_clusters = candidates[:MAX_REGULAR_CLUSTERS]
    clustered_set = set(w for c in surviving_clusters for w in c)
    misc_idxs = [i for i in range(total_words) if i not in clustered_set]
    
    # High-confidence re-attachment for outliers strongly bound to an existing cluster
    # Only re-attach if maximum peer similarity is >= 0.82 and average similarity is >= 0.75
    reattached_count = 0
    for m in misc_idxs[:]:
        best_c = None
        best_avg_sim = 0.75
        for c_id, c_idxs in enumerate(surviving_clusters):
            c_sims = sim_matrix[m, c_idxs]
            max_s = np.max(c_sims)
            avg_s = np.mean(c_sims)
            if max_s >= 0.82 and avg_s > best_avg_sim:
                best_avg_sim = avg_s
                best_c = c_id
        if best_c is not None:
            surviving_clusters[best_c].append(m)
            misc_idxs.remove(m)
            reattached_count += 1
            
    print(f"Re-attached {reattached_count} words with high-confidence similarity to established brackets.")

    # Sort regular clusters by size descending
    surviving_clusters.sort(key=lambda x: len(x), reverse=True)
    n_regular_clusters = len(surviving_clusters)
    
    total_clusters = n_regular_clusters + 1  # regular tight clusters + 1 Miscellaneous cluster
    print(f"Created {n_regular_clusters} strict similarity clusters + 1 Miscellaneous group = {total_clusters} total groups.")
    print(f"Words in tight clusters: {sum(len(c) for c in surviving_clusters)} | Outlier words in Miscellaneous: {len(misc_idxs)}")

    # 5. Dimensionality reduction (t-SNE) for 2D map visualization
    print("Computing 2D projection via t-SNE...")
    tsne = TSNE(n_components=2, perplexity=32, metric="cosine", init="pca", random_state=42)
    coords_raw = tsne.fit_transform(norm_embs)
    
    # Gently attract points in tight clusters toward their cluster center (18% pull)
    # Outliers stay in their natural t-SNE positions
    coords_adjusted = coords_raw.copy()
    for c_id, c_idxs in enumerate(surviving_clusters):
        c_center = np.mean(coords_raw[c_idxs], axis=0)
        for i in c_idxs:
            coords_adjusted[i] = 0.82 * coords_raw[i] + 0.18 * c_center
            
    # Normalize coordinates to range [-850, 850]
    min_xy = coords_adjusted.min(axis=0)
    max_xy = coords_adjusted.max(axis=0)
    scaled_coords = ((coords_adjusted - min_xy) / (max_xy - min_xy) * 1700 - 850)
    
    # 6. Generate Palette & Cluster Metadata
    palette = generate_palette(n_regular_clusters)
    MISC_COLOR = "#64748B"  # Sophisticated Slate-500 for outliers
    
    clusters = []
    cluster_labels = np.zeros(total_words, dtype=int)

    # Build regular clusters
    for c_id, c_idxs in enumerate(surviving_clusters):
        for idx in c_idxs:
            cluster_labels[idx] = c_id
            
        c_embs = norm_embs[c_idxs]
        center = np.mean(c_embs, axis=0)
        center /= np.linalg.norm(center)
        dists = np.dot(c_embs, center)
        sorted_c_idxs = [c_idxs[k] for k in np.argsort(-dists)]
        
        top_words_all = [words[k]["word"] for k in sorted_c_idxs]
        unique_top_words = list(dict.fromkeys(top_words_all))[:3]
        
        all_syns = [s for k in c_idxs for s in words[k]["synonyms"]]
        common_syns = [item for item, count in Counter(all_syns).most_common(5) 
                       if item.lower() not in [tw.lower() for tw in unique_top_words]]
        
        lead_words = " & ".join([w.capitalize() for w in unique_top_words[:2]])
        if common_syns:
            sub_tag = common_syns[0].capitalize()
            cluster_name = f"{lead_words} ({sub_tag})"
        elif len(unique_top_words) >= 3:
            sub_tag = unique_top_words[2].capitalize()
            cluster_name = f"{lead_words} ({sub_tag})"
        else:
            cluster_name = lead_words
        
        c_x = float(np.mean(scaled_coords[c_idxs, 0]))
        c_y = float(np.mean(scaled_coords[c_idxs, 1]))
        
        sample_defs = []
        for k in sorted_c_idxs[:5]:
            if words[k]["definitions"]:
                sample_defs.append(words[k]["definitions"][0])
                
        clusters.append({
            "id": c_id,
            "number": c_id + 1,
            "name": cluster_name,
            "color": palette[c_id],
            "word_count": len(c_idxs),
            "word_ids": [int(k) for k in c_idxs],
            "top_words": unique_top_words,
            "top_synonyms": common_syns[:4],
            "sample_defs": sample_defs[:3],
            "cx": round(c_x, 1),
            "cy": round(c_y, 1),
            "is_miscellaneous": False
        })

    # Build Miscellaneous (Outliers) cluster as the final group
    misc_cluster_id = n_regular_clusters
    for idx in misc_idxs:
        cluster_labels[idx] = misc_cluster_id
        
    clusters.append({
        "id": misc_cluster_id,
        "number": misc_cluster_id + 1,
        "name": "Miscellaneous (Outliers & Unique Terms)",
        "color": MISC_COLOR,
        "word_count": len(misc_idxs),
        "word_ids": [int(k) for k in misc_idxs],
        "top_words": ["Outliers", "Unique", "Distinct"],
        "top_synonyms": ["Unmatched", "Solitary", "Specialized"],
        "sample_defs": ["Terms with distinct, specialized, or solitary meanings that do not meet the strict similarity threshold to join a synonym bracket."],
        "cx": 0.0,
        "cy": 0.0,
        "is_miscellaneous": True
    })

    # 7. Assign cluster info to words
    for i in range(total_words):
        c_id = int(cluster_labels[i])
        words[i]["cluster_id"] = c_id
        words[i]["cluster_number"] = clusters[c_id]["number"]
        words[i]["cluster_name"] = clusters[c_id]["name"]
        words[i]["cluster_color"] = clusters[c_id]["color"]
        words[i]["is_miscellaneous"] = clusters[c_id]["is_miscellaneous"]
        words[i]["x"] = round(float(scaled_coords[i, 0]), 1)
        words[i]["y"] = round(float(scaled_coords[i, 1]), 1)
        
        # Update neighbor cluster_ids & colors
        for n in words[i]["nearest_neighbors"]:
            n_cid = int(cluster_labels[n["id"]])
            n["cluster_id"] = n_cid
            n["cluster_color"] = clusters[n_cid]["color"]
            
        del words[i]["embed_prompt"]

    # 8. Output dataset
    output_data = {
        "stats": {
            "total_words": total_words,
            "total_clusters": total_clusters,
            "regular_clusters": n_regular_clusters,
            "miscellaneous_words": len(misc_idxs),
            "total_groups": len(raw_data)
        },
        "clusters": clusters,
        "words": words
    }
    
    os.makedirs("web", exist_ok=True)
    json_path = os.path.join("web", "data.json")
    js_path = os.path.join("web", "data.js")
    
    print(f"Writing {json_path}...")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
        
    print(f"Writing {js_path} (for standalone file:// offline support)...")
    with open(js_path, "w", encoding="utf-8") as f:
        f.write("window.VOCAB_DATA = ")
        json.dump(output_data, f, ensure_ascii=False)
        f.write(";\n")
        
    print(f"🎉 Dataset generation complete! {total_clusters} groups ({n_regular_clusters} strict similarity brackets + 1 Miscellaneous group) generated.")

if __name__ == "__main__":
    main()
