import re

with open('src/app/child/documents/DocumentRow.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

view_func = '''  const handleView = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (doc.fileUrl.startsWith('http')) {
      window.open(doc.fileUrl, '_blank');
      return;
    }

    try {
      const arr = doc.fileUrl.split(',');
      const mime = arr[0].match(/:(.*?);/)?.[1] || doc.fileType;
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], {type: mime});
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    } catch(err) {
      console.error(err);
      alert("Unable to open document.");
    }
  }'''

content = content.replace('const handleDelete', view_func + '\n\n  const handleDelete')

# Replace the row click
content = content.replace('onClick={() => window.open(doc.fileUrl, "_blank")}', 'onClick={() => handleView()}')

# Replace the anchor tag with a button
old_anchor = r'<a href=\{doc.fileUrl\} target="_blank" rel="noopener noreferrer" onClick=\{\(e\) => e.stopPropagation\(\)\} className="text-blue-600 hover:text-blue-700 font-bold bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition inline-block">View</a>'
new_button = '<button onClick={handleView} className="text-blue-600 hover:text-blue-700 font-bold bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition inline-block">View</button>'

content = re.sub(old_anchor, new_button, content)

with open('src/app/child/documents/DocumentRow.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
