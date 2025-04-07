#!/usr/bin/env python3
import os

# --- Configuration ---
START_DIRECTORY = '.'  # Use '.' for the current directory
EXCLUDED_FILES = {'package-lock.json', '.DS_Store', 'LICENSE', '.package-lock.json', 'walker.py', 'crawl.out'}  # Set of filenames to exclude
EXCLUDED_DIRS = {'worker', 'public', '.git', 'node_modules', '.next'} # Set of directory names to exclude entirely

# --- Script Logic ---
def process_directory(start_dir, excluded_files, excluded_dirs):
    """
    Walks through a directory, printing file paths and contents,
    respecting exclusions.
    """
    start_dir = os.path.abspath(start_dir) # Get absolute path for reliable comparison

    for dirpath, dirnames, filenames in os.walk(start_dir, topdown=True):
        # --- Directory Exclusion ---
        # Modify dirnames in-place to prevent os.walk from descending
        # into excluded directories.
        # We use list comprehension to create a new list and assign it back to dirnames[:]
        dirnames[:] = [d for d in dirnames if d not in excluded_dirs]

        # --- File Processing ---
        for filename in filenames:
            # Check if the current file should be excluded by name
            if filename in excluded_files:
                continue

            # Construct the full path to the file
            full_path = os.path.join(dirpath, filename)

            # Get the path relative to the starting directory
            # Use os.path.normpath to clean up the path (e.g., remove './')
            relative_path = os.path.normpath(os.path.relpath(full_path, start_dir))

            # Ensure cross-platform path separators (optional, but nice)
            relative_path = relative_path.replace(os.sep, '/')

            # Print the header line
            print(f"---{relative_path}")

            # Read and print the file content
            try:
                # Using utf-8 encoding is common, but files might have different encodings.
                # errors='ignore' will skip characters that can't be decoded.
                # Use 'rb' for mode if you need to handle binary files without decoding issues,
                # but the output might not be human-readable.
                with open(full_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                    # Print content directly, which might include its own newlines
                    print(content, end='')
            except IOError as e:
                print(f"[Error reading file {relative_path}: {e}]")
            except Exception as e:
                 print(f"[An unexpected error occurred with file {relative_path}: {e}]")

            # Add a newline after the content to separate file outputs clearly
            # only if the content didn't already end with one.
            if content and not content.endswith('\n'):
                print() # Add a newline if content doesn't end with one
            print() # Add an extra blank line for clear separation


# --- Main Execution ---
if __name__ == "__main__":
    print(f"Scanning directory: {os.path.abspath(START_DIRECTORY)}")
    print(f"Excluding files: {', '.join(EXCLUDED_FILES) or 'None'}")
    print(f"Excluding directories: {', '.join(EXCLUDED_DIRS) or 'None'}")
    print("-" * 20) # Separator

    process_directory(START_DIRECTORY, EXCLUDED_FILES, EXCLUDED_DIRS)

    print("-" * 20) # Separator
    print("Scan complete.")