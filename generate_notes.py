#!/usr/bin/env python3
"""
Generate comprehensive Markdown notes from quant_mountain.json.
Preserves all mathematical notation, converts HTML formatting to clean Markdown,
embeds local diagrams from quant_assets/, and enriches visual topics with full notes.
"""

import json
import re
import html
from pathlib import Path
from bs4 import BeautifulSoup, NavigableString, Tag

WORKSPACE = Path("/home/aryansinghal/Desktop/vocab")
JSON_PATH = WORKSPACE / "quant_mountain.json"
ASSETS_DIR = WORKSPACE / "quant_assets"
OUT_MD = WORKSPACE / "quant-mountain-notes.md"

def github_slug(text: str) -> str:
    """Generate GitHub-compatible anchor slug."""
    text = text.lower()
    text = re.sub(r"[^\w\s\-]", "", text)
    text = re.sub(r"\s+", "-", text.strip())
    return text

# Supplemental conceptual notes for topics with visual SVGs or images
SUPPLEMENTAL_NOTES = {
    "the-number-line": r"""
- **Key Properties of the Real Number Line:**
  - Numbers increase strictly from left to right: for any two points $x$ and $y$, $x < y \iff x$ lies to the left of $y$.
  - Negative numbers decrease in value as their magnitude increases (e.g., $-3 < -2$ because $-3$ lies to the left of $-2$).
  - The distance between any two numbers $a$ and $b$ on the number line is given by $|a - b|$.
""",
    "the-x-y-coordinate-plane": r"""
- **Coordinate Axes:** The Cartesian plane consists of two perpendicular real number lines intersecting at the origin $(0, 0)$:
  - **Horizontal axis ($x$-axis):** Values increase to the right, decrease to the left.
  - **Vertical axis ($y$-axis):** Values increase going up, decrease going down.
- **The Four Quadrants:**
  - **Quadrant I (top-right):** $x > 0, y > 0$ — $(+, +)$
  - **Quadrant II (top-left):** $x < 0, y > 0$ — $(-, +)$
  - **Quadrant III (bottom-left):** $x < 0, y < 0$ — $(-, -)$
  - **Quadrant IV (bottom-right):** $x > 0, y < 0$ — $(+, -)$
- **Points on Axes:** Points lying on either axis do NOT belong to any quadrant (e.g., $(5, 0)$ lies on the positive $x$-axis; $(0, -3)$ lies on the negative $y$-axis).
""",
    "lines-and-curves": r"""
- **Line:** A straight one-dimensional geometric figure extending infinitely in both directions ($y = mx + b$).
- **Line Segment:** A finite portion of a line bounded by two distinct endpoints $(x_1, y_1)$ and $(x_2, y_2)$; length given by $d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$.
- **Circle:** The set of all points in a plane at a constant distance (radius $r$) from a fixed center $(h, k)$:
  $$(x - h)^2 + (y - k)^2 = r^2$$
- **Parabola:** The U-shaped graph of a quadratic function $y = ax^2 + bx + c$:
  - Opens upwards if $a > 0$ (vertex is a minimum).
  - Opens downwards if $a < 0$ (vertex is a maximum).
""",
    "reflections": r"""
Given an original point $(x, y)$, standard reflections in the coordinate plane:
- **Across the $x$-axis:** $(x, y) \to (x, -y)$ ($x$ remains the same, $y$ is negated).
- **Across the $y$-axis:** $(x, y) \to (-x, y)$ ($y$ remains the same, $x$ is negated).
- **Across the Origin $(0, 0)$:** $(x, y) \to (-x, -y)$ (both coordinates are negated; equivalent to $180^\circ$ rotation).
- **Across the line $y = x$:** $(x, y) \to (y, x)$ (coordinates swap places).
- **Across the line $y = -x$:** $(x, y) \to (-y, -x)$ (coordinates swap places and both are negated).
""",
    "symmetry-across-y-axis": r"""
- A curve or function is **symmetric across the $y$-axis** if reflecting the entire graph across the $y$-axis leaves it unchanged.
- **Algebraic Condition:** For every point $(x, y)$ on the curve, the point $(-x, y)$ is also on the curve.
- **Even Function:** $f(-x) = f(x)$.
- **Examples:** $y = x^2$, $y = x^4 - 3x^2$, $y = |x|$, $y = \cos(x)$.
""",
    "symmetry-across-x-axis": r"""
- A curve is **symmetric across the $x$-axis** if reflecting the graph across the $x$-axis leaves it unchanged.
- **Algebraic Condition:** For every point $(x, y)$ on the curve, the point $(x, -y)$ is also on the curve.
- **Note:** A curve with symmetry across the $x$-axis fails the vertical line test (except for $y = 0$) and therefore cannot represent a function of $x$.
- **Examples:** $x = y^2$, $x^2 + y^2 = r^2$.
""",
    "symmetry-about-the-origin": r"""
- A curve has **symmetry about the origin $(0, 0)$** if rotating the graph $180^\circ$ about the origin produces the exact same graph.
- **Algebraic Condition:** For every point $(x, y)$ on the curve, the point $(-x, -y)$ is also on the curve.
- **Odd Function:** $f(-x) = -f(x)$.
- **Examples:** $y = x^3$, $y = x$, $y = \frac{1}{x}$, $y = \sin(x)$.
""",
    "intercepts": r"""
- **$x$-intercept:** The point where a graph crosses or touches the $x$-axis.
  - Set $y = 0$ in the equation and solve for $x$.
  - Coordinates: $(x_0, 0)$.
- **$y$-intercept:** The point where a graph crosses or touches the $y$-axis.
  - Set $x = 0$ in the equation and solve for $y$.
  - Coordinates: $(0, y_0)$.
  - In slope-intercept form $y = mx + b$, $b$ is the $y$-intercept.
""",
    "parallel-lines": r"""
- **Parallel Lines:** Two distinct straight lines in the Cartesian plane that never intersect.
- **Conditions:**
  - **Equal slopes:** $m_1 = m_2$
  - **Different $y$-intercepts:** $b_1 \ne b_2$
- **System of Equations:** A system representing two parallel lines has **zero solutions** ($0$ points of intersection).
""",
    "perpendicular-lines": r"""
- **Perpendicular Lines:** Two straight lines that intersect at a right angle ($90^\circ$).
- **Condition:** Their slopes are **negative reciprocals**:
  $$m_1 \cdot m_2 = -1 \iff m_2 = -\frac{1}{m_1}$$
- **Examples:**
  - If $m_1 = \frac{3}{4}$, then $m_2 = -\frac{4}{3}$.
  - If $m_1 = -2$, then $m_2 = \frac{1}{2}$.
- **Horizontal & Vertical Exception:** A horizontal line ($m = 0$) is perpendicular to a vertical line (slope undefined).
""",
    "system-of-equations-d3co": r"""
- **Graphical Meaning of Systems:**
  - Graphing two linear equations displays two straight lines.
  - The intersection point $(x, y)$ is the unique common solution satisfying both equations simultaneously.
  - **Summary of Solutions:**
    - **1 Solution:** Lines intersect at 1 point ($m_1 \ne m_2$).
    - **0 Solutions:** Lines are parallel ($m_1 = m_2, b_1 \ne b_2$).
    - **Infinitely Many Solutions:** Lines are identical ($m_1 = m_2, b_1 = b_2$).
""",
    "graphing-inequalities-1": r"""
- **Graphing a Linear Inequality ($y \le 2x + 1$):**
  1. Graph the boundary line $y = 2x + 1$.
  2. **Boundary Line Style:**
     - Use a **solid line** for $\le$ or $\ge$ (points on the line are included).
     - Use a **dashed line** for $<$ or $>$ (points on the line are excluded).
  3. **Shading:**
     - For $y \le \dots$ or $y < \dots$, shade the region **below** the line.
     - For $y \ge \dots$ or $y > \dots$, shade the region **above** the line.
     - Test point $(0, 0)$: $0 \le 2(0) + 1 \implies 0 \le 1$ (True), so shade the half-plane containing $(0, 0)$.
""",
    "graphing-inequalities-2": r"""
- **Graphing $y > -\frac{1}{2}x + 3$:**
  - Draw the line $y = -\frac{1}{2}x + 3$ as a **dashed line** because the inequality is strict ($>$).
  - Shade the region **strictly above** the dashed line.
  - Test point $(0, 0)$: $0 > 3$ is False, so the half-plane containing $(0, 0)$ is unshaded.
""",
    "graphing-inequalities-3": r"""
- **Systems of Linear Inequalities:**
  - Graph each individual inequality on the coordinate plane.
  - The solution set of the system is the **intersection (overlapping shaded region)** satisfying all inequalities simultaneously.
  - Any coordinate point within the overlapping feasible region is a valid solution.
""",
    "rotating-90": r"""
- Rotating a point $(x, y)$ about the origin $(0, 0)$:
  - The absolute magnitudes of the coordinates swap places ($x \leftrightarrow y$).
  - Signs adjust according to the destination quadrant:
  - **$90^\circ$ Counter-Clockwise (CCW):** $(x, y) \to (-y, x)$
  - **$90^\circ$ Clockwise (CW):** $(x, y) \to (y, -x)$
  - **$180^\circ$ Rotation:** $(x, y) \to (-x, -y)$
  - **$270^\circ$ CCW (= $90^\circ$ CW):** $(x, y) \to (y, -x)$
""",
    "lines": r"""
- **Line ($\overleftrightarrow{AB}$):** Extends infinitely in both directions without endpoints; has infinite length.
- **Ray ($\overrightarrow{AB}$):** Starts at an initial endpoint $A$ and extends infinitely in one direction through point $B$.
- **Line Segment ($\overline{AB}$):** A bounded straight path connecting two endpoints $A$ and $B$; has a finite, measurable length.
""",
    "types-of-angles": r"""
- **Acute Angle:** Strictly between $0^\circ$ and $90^\circ$ ($0^\circ < \theta < 90^\circ$).
- **Right Angle:** Exactly $90^\circ$ (indicated by a small square box at the vertex).
- **Obtuse Angle:** Strictly between $90^\circ$ and $180^\circ$ ($90^\circ < \theta < 180^\circ$).
- **Straight Angle:** Exactly $180^\circ$ (forms a straight line).
- **Reflex Angle:** Strictly between $180^\circ$ and $360^\circ$ ($180^\circ < \theta < 360^\circ$).
- **Supplementary Angles:** Two angles whose measures sum to $180^\circ$.
- **Complementary Angles:** Two angles whose measures sum to $90^\circ$.
""",
    "parallel-lines-and-angles": r"""
When two parallel lines $p \parallel q$ are intersected by a transversal line, 8 angles are created consisting of only **two angle measures**: acute $\alpha$ and obtuse $\beta$ (where $\alpha + \beta = 180^\circ$):
- **Alternate Interior Angles are equal:** Angles on opposite sides of transversal between parallel lines.
- **Alternate Exterior Angles are equal:** Angles on opposite sides of transversal outside parallel lines.
- **Corresponding Angles are equal:** Angles in the same relative position at each intersection.
- **Consecutive (Same-Side) Interior Angles are supplementary:** $\alpha + \beta = 180^\circ$.
- **Vertically Opposite Angles are equal:** Angles directly across from each other at an intersection.
""",
    "degrees-of-a-triangle": r"""
- **Interior Angles Sum:** For any triangle with interior angles $a, b, c$:
  $$a + b + c = 180^\circ$$
- **Exterior Angle Theorem:** An exterior angle $d$ formed by extending one side of a triangle equals the sum of the two remote (opposite) interior angles:
  $$d = b + c$$
- **Consequence:** An exterior angle is strictly greater than either remote interior angle:
  $$d > b \quad \text{and} \quad d > c$$
""",
    "angle-vs-side-length": r"""
- In any triangle, the relative lengths of the sides correspond strictly to the measures of their opposite angles:
  - The **largest angle** is always opposite the **longest side**.
  - The **smallest angle** is always opposite the **shortest side**.
  - If side lengths are ordered $a > b > c$, then their opposite angles satisfy $q > r > p$.
  - Equal sides are always opposite equal angles (e.g., isosceles triangles have 2 equal sides opposite 2 equal angles; equilateral triangles have 3 equal sides opposite 3 equal angles of $60^\circ$).
""",
    "30-60-90-triangles": r"""
- **Side Ratio:** The sides of a $30^\circ-60^\circ-90^\circ$ right triangle are always in the constant ratio $1 : \sqrt{3} : 2$, or:
  $$x : x\sqrt{3} : 2x$$
  - **Short leg (opposite $30^\circ$):** $x$
  - **Long leg (opposite $60^\circ$):** $x\sqrt{3}$
  - **Hypotenuse (opposite $90^\circ$):** $2x$
- **High-Yield Strategy:** Always identify the short leg first. If you know any one side of a $30-60-90$ triangle, you can find the other two immediately!
""",
    "45-45-90-triangles": r"""
- **Side Ratio:** A $45^\circ-45^\circ-90^\circ$ triangle is an **isosceles right triangle** with sides in the ratio $1 : 1 : \sqrt{2}$, or:
  $$x : x : x\sqrt{2}$$
  - **Legs (opposite $45^\circ$):** $x$ and $x$
  - **Hypotenuse (opposite $90^\circ$):** $x\sqrt{2}$
- **Diagonal of a Square:** Cutting a square of side length $s$ along its diagonal creates two $45-45-90$ right triangles; the diagonal length is $d = s\sqrt{2}$.
""",
    "parallelograms": r"""
A **parallelogram** is a 4-sided polygon with two pairs of parallel opposite sides ($AB \parallel CD$ and $BC \parallel AD$).
- **Key Properties:**
  - Opposite sides are parallel and equal in length: $AB = CD$ and $BC = AD$.
  - Opposite angles are equal: $\angle A = \angle C$ and $\angle B = \angle D$.
  - Consecutive angles are supplementary: $\angle A + \angle B = 180^\circ$.
  - Diagonals bisect each other (each diagonal cuts the other into two equal halves).
  - Area formula:
    $$\text{Area} = \text{base} \times \text{height} = b \cdot h$$
    *(Note: height must be perpendicular to the base, not the slanted side length).*
""",
    "isosceles-trapeziums": r"""
An **isosceles trapezoid** (or isosceles trapezium) has one pair of parallel bases and two non-parallel legs of equal length:
- Non-parallel sides (legs) are equal in length.
- Both pairs of base angles are equal (angles along the bottom base are equal, and angles along the top base are equal).
- Diagonals are congruent (equal in length).
- It possesses a vertical line of reflective symmetry down the middle.
""",
    "dividing-quadrilaterals-1": r"""
- Drawing a diagonal in any parallelogram splits it into **two congruent triangles** of identical area:
  $$\text{Area of each triangle} = \frac{1}{2} \times \text{Area of parallelogram}$$
- Drawing both diagonals divides the parallelogram into **four triangles of equal area** (all four triangles have the exact same area).
""",
    "dividing-quadrilaterals-2": r"""
- To find the area or dimensions of irregular quadrilaterals or trapezoids:
  - Drop perpendicular heights (altitudes) from vertices to the opposite base.
  - Decompose the complex shape into standard geometric components: typically a central rectangle and one or two right-angled triangles.
  - Apply the Pythagorean theorem to right triangles to calculate missing heights or base lengths.
""",
    "circles-1": r"""
- **Center ($O$):** The fixed interior point equidistant from every point on the circumference.
- **Radius ($r$):** The distance from the center to any point on the boundary.
- **Diameter ($d$):** A straight line segment passing through the center connecting two points on the circle:
  $$d = 2r$$
- **Circumference ($C$):** The total perimeter around the circle:
  $$C = 2\pi r = \pi d$$
""",
    "circles-2": r"""
- **Central Angle ($x^\circ$):** An angle whose vertex is at the center of the circle.
- **Sector (Region $R$):** The "pie slice" region bounded by two radii and an intercepted arc:
  $$\text{Area of Sector} = \left(\frac{x^\circ}{360^\circ}\right) \pi r^2$$
- **Arc ($ABC$):** The curved section of the circumference bounded by two points:
  $$\text{Arc Length} = \left(\frac{x^\circ}{360^\circ}\right) 2\pi r$$
- **Chord ($PQ$):** Any line segment connecting two points on the circle. The longest possible chord is the diameter.
""",
    "central-angle-theorem": r"""
- **Inscribed Angle Theorem:** The measure of an inscribed angle (vertex on the circle boundary) is exactly **half** the central angle subtending the same arc:
  $$\text{Inscribed Angle} = \frac{1}{2} \times \text{Central Angle}$$
- **Equal Inscribed Angles:** Any two inscribed angles that subtend the same arc are equal in measure.
- **Angle Inscribed in a Semicircle (Thales's Theorem):** An inscribed angle that intercepts a diameter is always a right angle ($90^\circ$).
""",
    "presenting-data-2": r"""
- **Bar Charts:** Display counts, frequencies, or values of discrete categorical variables.
- **Grouped / Clustered Bar Charts:** Compare multiple categories across different groups side by side (e.g., comparing populations of Giraffes, Orangutans, Monkeys at SF Zoo vs LF Zoo).
- **Histograms:** Display continuous numerical data divided into contiguous, equal-width intervals (bins). The area/height of each bar represents frequency. Bars touch each other without gaps unless a bin has zero count.
""",
    "presenting-data-3": r"""
- **Pie Charts:** Circular statistical graphic where sectors represent percentage proportions of a complete whole ($100\%$):
  $$\text{Central Angle of Slice} = (\text{Percentage}) \times 360^\circ$$
- **Scatter Plots:** Graphical display of paired bivariate data $(x, y)$ on a coordinate grid:
  - **Positive Correlation:** As $x$ increases, $y$ increases (points trend upward from left to right).
  - **Negative Correlation:** As $x$ increases, $y$ decreases (points trend downward from left to right).
  - **No Correlation:** Points are randomly distributed with no apparent linear pattern.
""",
    "boxplots": r"""
A **Boxplot (Box-and-Whisker Plot)** visually summarizes a dataset using the **5-Number Summary**:
1. **Minimum:** The smallest value in the dataset (tip of the left whisker).
2. **First Quartile ($Q_1$):** 25th percentile (left edge of the box).
3. **Median ($Q_2$):** 50th percentile (vertical line dividing the box).
4. **Third Quartile ($Q_3$):** 75th percentile (right edge of the box).
5. **Maximum:** The largest value in the dataset (tip of the right whisker).
- **Interquartile Range ($\text{IQR}$):** The width of the box, containing the central $50\%$ of the data:
  $$\text{IQR} = Q_3 - Q_1$$
- **Whiskers:** Each whisker and each half of the box contains approximately $25\%$ of the data observations.
""",
    "the-two-extremes": r"""
When dealing with two overlapping sets $A$ and $B$ within a universal set of total size $T$:
- **Maximum Intersection (Max Overlap):**
  - Occurs when the smaller set is completely contained within the larger set:
    $$\text{Max Overlap} = \min(|A|, |B|)$$
- **Minimum Intersection (Min Overlap):**
  - Occurs when the number of elements in "Neither" set is minimized (ideally $0$):
    $$\text{Min Overlap} = \max(0, |A| + |B| - T)$$
""",
    "probability-and-venn-diagrams": r"""
Using Venn diagrams to analyze event probabilities:
- **General Addition Rule:**
  $$P(A \cup B) = P(A) + P(B) - P(A \cap B)$$
- **Mutually Exclusive Events:** $A$ and $B$ cannot occur simultaneously ($P(A \cap B) = 0$):
  $$P(A \cup B) = P(A) + P(B)$$
- **Probability of Only $A$:**
  $$P(A \text{ only}) = P(A) - P(A \cap B)$$
- **Probability of Neither $A$ nor $B$:**
  $$P(\text{Neither}) = 1 - P(A \cup B)$$
""",
    "skewness": r"""
Skewness describes the asymmetry of a distribution:
- **Positive Skew (Right-Skewed):**
  - The tail is longer on the right side.
  - Extreme high outliers pull the mean to the right:
    $$\text{Mode} < \text{Median} < \text{Mean}$$
- **Negative Skew (Left-Skewed):**
  - The tail is longer on the left side.
  - Extreme low outliers pull the mean to the left:
    $$\text{Mean} < \text{Median} < \text{Mode}$$
- **Symmetric Distribution (Normal):**
  - Balanced tails on both sides:
    $$\text{Mean} \approx \text{Median} \approx \text{Mode}$$
""",
    "skewness-and-the-mean": r"""
- **Summary of Skewness vs. Central Tendency:**
  - **Negative Skew (Left-Skewed):**
    - Tail points to the left (negative direction).
    - Extreme low outliers pull the mean down:
      $$\text{Mean} < \text{Median} < \text{Mode}$$
  - **Symmetric (Normal Distribution):**
    - Balanced bell shape with no skew.
      $$\text{Mean} = \text{Median} = \text{Mode}$$
  - **Positive Skew (Right-Skewed):**
    - Tail points to the right (positive direction).
    - Extreme high outliers pull the mean up:
      $$\text{Mode} < \text{Median} < \text{Mean}$$
""",
    "normal-distribution-1": r"""
The **Normal Distribution** is a symmetric, bell-shaped continuous distribution centered at mean $\mu$ with standard deviation $\sigma$:
- **Empirical Rule (68-95-99.7 Rule):**
  - **$\mu \pm 1\sigma$:** Contains $\approx 68.2\%$ of the data ($34.1\%$ between $\mu$ and $\mu + \sigma$, and $34.1\%$ between $\mu - \sigma$ and $\mu$).
  - **$\mu \pm 2\sigma$:** Contains $\approx 95.4\%$ of the data ($13.6\%$ between $\mu + \sigma$ and $\mu + 2\sigma$, and $13.6\%$ between $\mu - 2\sigma$ and $\mu - \sigma$).
  - **$\mu \pm 3\sigma$:** Contains $\approx 99.7\%$ of the data ($2.15\%$ between $\mu + 2\sigma$ and $\mu + 3\sigma$, and $2.15\%$ between $\mu - 3\sigma$ and $\mu - 2\sigma$).
  - **Beyond $3\sigma$:** Contains $\approx 0.15\%$ in each extreme tail ($0.3\%$ total).
- The mean, median, and mode are all equal and located at the center peak: $\mu = \text{Median} = \text{Mode}$.
"""
}

IMAGE_MAP = {
    "https://gregmatapi.s3.amazonaws.com/media/misc/files/CleanShot_2023-12-26_at_23.54.102x.png": "quant_assets/the-number-line_CleanShot_2023-12-26_at_23.54.102x.png",
    "https://gregmatapi.s3.amazonaws.com/media/misc/files/CleanShot_2023-12-27_at_14.14.242x.png": "quant_assets/graphing-inequalities-1_CleanShot_2023-12-27_at_14.14.242x.png",
    "https://gregmatapi.s3.amazonaws.com/media/misc/files/CleanShot_2023-12-27_at_14.24.222x.png": "quant_assets/graphing-inequalities-2_CleanShot_2023-12-27_at_14.24.222x.png",
    "https://gregmatapi.s3.amazonaws.com/media/misc/files/CleanShot_2023-12-27_at_14.26.552x.png": "quant_assets/graphing-inequalities-3_CleanShot_2023-12-27_at_14.26.552x.png",
    "https://gregmatapi.s3.amazonaws.com/media/misc/files/CleanShot_2023-12-27_at_14.35.012x_1.png": "quant_assets/30-60-90-triangles_CleanShot_2023-12-27_at_14.35.012x_1.png",
    "https://gregmatapi.s3.amazonaws.com/media/misc/files/CleanShot_2023-12-27_at_14.39.322x.png": "quant_assets/45-45-90-triangles_CleanShot_2023-12-27_at_14.39.322x.png",
    "https://upload.wikimedia.org/wikipedia/commons/c/cc/Relationship_between_mean_and_median_under_different_skewness.png": "quant_assets/skewness-and-the-mean_Relationship_between_mean_and_median_under_different_skewness.png",
}

def convert_html_to_markdown(html_str: str, slug: str, title: str) -> str:
    """Convert HTML string to clean, properly formatted Markdown."""
    if not html_str:
        return ""
    
    soup = BeautifulSoup(html_str, "html.parser")

    # Replace <img> tags with markdown image embeds
    for img in soup.find_all("img"):
        src = img.get("src", "")
        alt = img.get("alt", title)
        local_src = IMAGE_MAP.get(src, src)
        img.replace_with(f"\n\n![{alt}]({local_src})\n\n")

    # Replace <svg> tags with markdown embeds
    top_svgs = [s for s in soup.find_all("svg") if not s.find_parent("svg")]
    if len(top_svgs) == 1:
        top_svgs[0].replace_with(f"\n\n![{title} Diagram](quant_assets/{slug}.svg)\n\n")
    elif len(top_svgs) > 1:
        for idx, s in enumerate(top_svgs):
            s.replace_with(f"\n\n![{title} Diagram {idx+1}](quant_assets/{slug}_{idx+1}.svg)\n\n")

    # Clean out any remaining nested/orphan SVG tags
    for s in soup.find_all("svg"):
        s.decompose()

    # Process tables into GitHub Markdown tables
    for table in soup.find_all("table"):
        rows = []
        caption = table.find("caption")
        caption_text = f"**{caption.get_text().strip()}**\n\n" if caption else ""
        for tr in table.find_all("tr"):
            cells = [c.get_text().strip().replace("\n", " ") for c in tr.find_all(["th", "td"])]
            if cells:
                rows.append(cells)
        if rows:
            header = rows[0]
            md_table = caption_text + "| " + " | ".join(header) + " |\n"
            md_table += "| " + " | ".join([":---"] * len(header)) + " |\n"
            for r in rows[1:]:
                while len(r) < len(header):
                    r.append("")
                md_table += "| " + " | ".join(r[:len(header)]) + " |\n"
            table.replace_with(f"\n\n{md_table}\n\n")

    # Convert DOM elements recursively
    def parse_node(node, depth=0, list_type="ul", list_num=1):
        if isinstance(node, NavigableString):
            txt = str(node)
            txt = txt.replace("\r\n", "\n").replace("\r", "\n")
            return txt
        if not isinstance(node, Tag):
            return ""

        tag = node.name

        if tag in ["strong", "b"]:
            inner = "".join(parse_node(c, depth) for c in node.children).strip()
            return f"**{inner}**" if inner else ""
        elif tag in ["em", "i"]:
            inner = "".join(parse_node(c, depth) for c in node.children).strip()
            return f"*{inner}*" if inner else ""
        elif tag == "u":
            inner = "".join(parse_node(c, depth) for c in node.children).strip()
            return f"<u>{inner}</u>" if inner else ""
        elif tag == "code":
            inner = "".join(parse_node(c, depth) for c in node.children)
            return f"`{inner}`"
        elif tag == "sup":
            inner = "".join(parse_node(c, depth) for c in node.children).strip()
            return f"^{inner}"
        elif tag == "br":
            return "\n"
        elif tag == "hr":
            return "\n\n---\n\n"
        elif tag == "a":
            href = node.get("href", "")
            inner = "".join(parse_node(c, depth) for c in node.children).strip()
            return f"[{inner}]({href})" if href else inner
        elif tag in ["h2", "h3", "h4"]:
            inner = "".join(parse_node(c, depth) for c in node.children).strip()
            prefix = "####" if tag == "h2" else "#####"
            return f"\n\n{prefix} {inner}\n\n"
        elif tag == "blockquote":
            inner = "".join(parse_node(c, depth) for c in node.children).strip()
            lines = inner.split("\n")
            quoted = "\n".join(f"> {l}" for l in lines)
            return f"\n\n{quoted}\n\n"
        elif tag in ["p", "center"]:
            inner = "".join(parse_node(c, depth) for c in node.children).strip()
            return f"\n\n{inner}\n\n" if inner else ""
        elif tag == "ul":
            items = []
            for c in node.children:
                if isinstance(c, Tag) and c.name == "li":
                    items.append(parse_node(c, depth + 1, list_type="ul"))
            return "\n" + "\n".join(items) + "\n"
        elif tag == "ol":
            items = []
            num = 1
            for c in node.children:
                if isinstance(c, Tag) and c.name == "li":
                    items.append(parse_node(c, depth + 1, list_type="ol", list_num=num))
                    num += 1
            return "\n" + "\n".join(items) + "\n"
        elif tag == "li":
            indent = "  " * (depth - 1)
            bullet = f"{indent}- " if list_type == "ul" else f"{indent}{list_num}. "
            inline_bits = []
            sublist_bits = []
            for c in node.children:
                if isinstance(c, Tag) and c.name in ["ul", "ol"]:
                    sublist_bits.append(parse_node(c, depth))
                else:
                    inline_bits.append(parse_node(c, depth))
            text = "".join(inline_bits).strip()
            sublist = "".join(sublist_bits)
            return f"{bullet}{text}{sublist}"
        else:
            return "".join(parse_node(c, depth) for c in node.children)

    res = parse_node(soup)

    # Decode HTML entities while keeping math safe
    res = html.unescape(res)

    # Normalize double linebreaks
    res = re.sub(r"[ \t]+$", "", res, flags=re.MULTILINE)
    res = re.sub(r"\n{3,}", "\n\n", res)

    return res.strip()


def build_notes():
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    doc = []
    doc.append("# GregMat Quant Mountain — Complete Revision Notes\n")
    doc.append("Comprehensive, high-yield mathematical revision notes covering all fundamental definitions, rules, formulas, examples, and diagrammatic interpretations from **GregMat's Quant Mountain** (Groups 1–17).\n")
    doc.append("---\n")

    # Table of Contents
    doc.append("## Table of Contents\n")
    for g_idx, group in enumerate(data, 1):
        g_title = group["title"].strip()
        g_slug = github_slug(g_title)
        doc.append(f"{g_idx}. [**{g_title}**](#{g_slug})")
        topics = group.get("mountain_contents", [])
        topic_links = []
        for t_idx, t in enumerate(topics, 1):
            t_title = t["title"].strip()
            item_heading = f"{g_idx}.{t_idx} {t_title}"
            t_slug = github_slug(item_heading)
            topic_links.append(f"[{g_idx}.{t_idx} {t_title}](#{t_slug})")
        doc.append(f"   - " + " • ".join(topic_links))

    doc.append("\n---\n")

    # Render each group
    for g_idx, group in enumerate(data, 1):
        g_title = group["title"].strip()
        doc.append(f"\n# {g_title}\n")

        topics = group.get("mountain_contents", [])
        for t_idx, topic in enumerate(topics, 1):
            t_title = topic["title"].strip()
            t_slug = topic.get("slug", "")
            desc_html = topic.get("description", "")

            item_heading = f"{g_idx}.{t_idx} {t_title}"
            doc.append(f"### {item_heading}\n")

            # Converted HTML content
            md_content = convert_html_to_markdown(desc_html, t_slug, t_title)
            if md_content:
                doc.append(md_content + "\n")

            # Check for supplemental visual notes
            if t_slug in SUPPLEMENTAL_NOTES:
                doc.append(SUPPLEMENTAL_NOTES[t_slug].strip() + "\n")

            doc.append("\n---\n")

    full_text = "\n".join(doc)
    full_text = re.sub(r"\n{3,}", "\n\n", full_text)

    OUT_MD.write_text(full_text, encoding="utf-8")
    print(f"Generated notes written to: {OUT_MD}")
    print(f"Total lines: {len(full_text.splitlines())}")
    print(f"Total characters: {len(full_text)}")

    # Symlink quant_mountain_notes.md to quant-mountain-notes.md
    alt_out = WORKSPACE / "quant_mountain_notes.md"
    if not alt_out.exists():
        alt_out.symlink_to("quant-mountain-notes.md")
        print(f"Created symlink: {alt_out} -> quant-mountain-notes.md")

if __name__ == "__main__":
    build_notes()
