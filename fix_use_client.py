import glob
import os

files = [
    'src/app/child/medications/AddMedicineForm.tsx',
    'src/app/child/medications/EditMedicineModal.tsx',
    'src/app/child/tasks/AddTaskForm.tsx',
    'src/app/elder/medications/ElderAddMedicationForm.tsx',
    'src/app/elder/tasks/ElderAddTaskForm.tsx'
]

for file_path in files:
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        # Check if 'use client' is not the first line and 'convertTo12Hour' is
        new_lines = []
        use_client_found = False
        import_line = None
        
        for line in lines:
            if line.strip() == '"use client"' or line.strip() == "'use client'":
                use_client_found = True
            elif 'convertTo12Hour' in line and not use_client_found:
                import_line = line
                continue
            new_lines.append(line)
        
        if import_line:
            # We found the import line before use client. We need to move it AFTER use client
            # Let's just rewrite the top of the file properly
            final_lines = []
            for line in lines:
                if 'convertTo12Hour' in line and line.startswith('import'):
                    pass # skip it
                elif line.strip() == '"use client"' or line.strip() == "'use client'":
                    final_lines.append('"use client"\n')
                    final_lines.append(import_line)
                else:
                    final_lines.append(line)
                    
            with open(file_path, 'w', encoding='utf-8') as f:
                f.writelines(final_lines)

