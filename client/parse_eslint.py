import json
import os
from collections import defaultdict

def parse_report(report_path):
    with open(report_path, 'r') as f:
        data = json.load(f)

    folder_counts = defaultdict(int)
    actionable_issues = []

    for entry in data:
        file_path = entry['filePath']
        # Get relative path from client directory
        rel_path = os.path.relpath(file_path, '/home/gabriel/dev/lunaris/client')
        
        # Skip files in src/pages
        if rel_path.startswith('src/pages'):
            continue

        messages = entry.get('messages', [])
        for msg in messages:
            # Actionable: severity 2 is error, 1 is warning
            # We'll include both as "actionable"
            issue = {
                'file': rel_path,
                'line': msg.get('line'),
                'rule': msg.get('ruleId'),
                'message': msg.get('message')
            }
            actionable_issues.append(issue)
            
            folder = os.path.dirname(rel_path) or '.'
            folder_counts[folder] += 1

    print("--- Actionable Issues (Outside src/pages) ---")
    for issue in actionable_issues:
        print(f"File: {issue['file']}, Line: {issue['line']}, Rule: {issue['rule']}, Message: {issue['message']}")

    print("\n--- Folder Counts ---")
    for folder, count in sorted(folder_counts.items()):
        print(f"{folder}: {count}")

if __name__ == "__main__":
    parse_report('eslint-report.json')
