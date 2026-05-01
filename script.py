with open('c:/GGMA/GGMA/src/App.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

c3_end = 1717
high_start = 1834
high_end = 1858
highlights_lines = lines[high_start:high_end]
del lines[high_start:high_end]

for i, line in enumerate(lines):
    if 'Founder Credentials + Company Stats' in line:
        grid_line_idx = i + 1
        lines[grid_line_idx] = lines[grid_line_idx].replace('md:grid-cols-2', 'max-w-4xl mx-auto')

new_highlights = [
    '      {/* Platform Highlights Section */}\n',
    '      <section className="py-20 px-6 bg-slate-50 border-t border-slate-200">\n',
    '        <div className="max-w-6xl mx-auto">\n'
] + highlights_lines + [
    '        </div>\n',
    '      </section>\n',
    '\n'
]

for i in reversed(range(len(new_highlights))):
    lines.insert(c3_end, new_highlights[i])

with open('c:/GGMA/GGMA/src/App.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)
