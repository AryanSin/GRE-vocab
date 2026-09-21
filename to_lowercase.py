#!/usr/bin/env python3
"""
Script to convert all text in markdown file(s) to lowercase.
"""

import argparse
import shutil
import sys
from pathlib import Path


def convert_file_to_lowercase(
    file_path: Path,
    output_path: Path | None = None,
    backup: bool = False,
    to_stdout: bool = False,
) -> bool:
    """Converts the text content of a file to lowercase."""
    if not file_path.exists():
        print(f"Error: File not found: {file_path}", file=sys.stderr)
        return False

    if not file_path.is_file():
        print(f"Error: '{file_path}' is not a file.", file=sys.stderr)
        return False

    try:
        content = file_path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        try:
            content = file_path.read_text(encoding="utf-8", errors="replace")
        except Exception as e:
            print(f"Error reading {file_path}: {e}", file=sys.stderr)
            return False
    except Exception as e:
        print(f"Error reading {file_path}: {e}", file=sys.stderr)
        return False

    lowercased = content.lower()

    if to_stdout:
        sys.stdout.write(lowercased)
        return True

    target_path = output_path if output_path is not None else file_path

    # If modifying in-place and backup requested
    if backup and target_path == file_path:
        backup_path = file_path.with_suffix(file_path.suffix + ".bak")
        try:
            shutil.copy2(file_path, backup_path)
            print(f"Created backup: {backup_path}")
        except Exception as e:
            print(f"Failed to create backup for {file_path}: {e}", file=sys.stderr)
            return False

    try:
        target_path.write_text(lowercased, encoding="utf-8")
        if target_path == file_path:
            print(f"Converted '{file_path}' to lowercase (in-place).")
        else:
            print(f"Saved lowercased output to '{target_path}'.")
        return True
    except Exception as e:
        print(f"Error writing to {target_path}: {e}", file=sys.stderr)
        return False


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Convert all text in markdown file(s) to lowercase."
    )
    parser.add_argument(
        "files",
        nargs="+",
        type=Path,
        help="Path to one or more markdown files to convert.",
    )
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        default=None,
        help="Output file path (only applicable when converting a single input file).",
    )
    parser.add_argument(
        "-b",
        "--backup",
        action="store_true",
        help="Create a .bak backup file before overwriting in-place.",
    )
    parser.add_argument(
        "-s",
        "--stdout",
        action="store_true",
        help="Print result to stdout instead of modifying or writing to a file.",
    )

    args = parser.parse_args()

    if args.output is not None and len(args.files) > 1:
        parser.error("-o/--output can only be used when a single file is specified.")

    success_count = 0
    for file_path in args.files:
        ok = convert_file_to_lowercase(
            file_path=file_path,
            output_path=args.output,
            backup=args.backup,
            to_stdout=args.stdout,
        )
        if ok:
            success_count += 1

    if success_count != len(args.files):
        sys.exit(1)


if __name__ == "__main__":
    main()
