import re

# 1. Fix GlobalHeader - simulation mode ONLY for founder email
with open('src/components/GlobalHeader.tsx', 'r', encoding='utf-8') as f:
    h = f.read()

old_god = "const isGodModeEligible = (userProfile.email?.includes('globalgreenhp@gmail.com') || userProfile.email?.includes('mgreen')) && !roleOverride;"
new_god = "const isGodModeEligible = userProfile.email === 'globalgreenhp@gmail.com' && !roleOverride;"
h = h.replace(old_god, new_god)

with open('src/components/GlobalHeader.tsx', 'w', encoding='utf-8') as f:
    f.write(h)
print('1. GlobalHeader: Simulation locked to ONLY globalgreenhp@gmail.com')


# 2. Verify States Dropdown is in App.tsx
with open('src/App.tsx', 'r', encoding='utf-8') as f:
    app = f.read()

if 'STATES DROPDOWN BAR' in app:
    print('2. States dropdown IS in App.tsx already')
else:
    print('2. States dropdown NOT FOUND - injecting now...')
    
    # Find the red alert banner and inject right after it
    # The red alert banner pattern
    banner_end = app.find('</div>\n')
    
    # Search for the broadcastMsg ticker
    ticker_pattern = 'animate-marquee-fast'
    ticker_idx = app.find(ticker_pattern)
    if ticker_idx == -1:
        ticker_pattern = 'animate-marquee'
        ticker_idx = app.find(ticker_pattern)
    
    if ticker_idx > -1:
        # Find the closing </div> of the ticker container (two levels up)
        # Go forward from ticker to find closing tags
        search_from = ticker_idx
        # Find the next occurrence of a section or major div after the ticker
        # Let's look for the pattern after the red banner
        
        # Alternative: find the "IN THE KNOW" section end
        in_the_know_idx = app.find('IN THE KNOW')
        if in_the_know_idx > -1:
            # Find the next </div> block after this
            close_count = 0
            pos = in_the_know_idx
            while pos < len(app):
                if app[pos:pos+6] == '</div>':
                    close_count += 1
                    if close_count >= 3:
                        # Insert after this closing div
                        insert_pos = pos + 6
                        states_html = """
        {/* ═══ STATES DROPDOWN BAR ═══ */}
        <div style={{background:'#f1f5f9',borderBottom:'1px solid #e2e8f0',padding:'8px 24px',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',zIndex:55,boxShadow:'inset 0 2px 4px rgba(0,0,0,0.06)'}}>
          {jurisdiction && setJurisdiction && (
            <div style={{display:'flex',alignItems:'center',gap:'8px',padding:'6px 12px',borderRadius:'8px'}}>
              <MapPin size={16} style={{color:'#dc2626'}} />
              <span style={{fontSize:'13px',fontWeight:900,color:'#334155',textTransform:'uppercase',letterSpacing:'0.1em'}}>Select Jurisdiction:</span>
              <select 
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                style={{background:'transparent',fontSize:'13px',fontWeight:900,color:'#1a4731',outline:'none',cursor:'pointer',borderBottom:'2px solid #1a4731',paddingBottom:'2px',marginLeft:'8px'}}
              >
                {['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}
        </div>
"""
                        app = app[:insert_pos] + states_html + app[insert_pos:]
                        print('   Injected states dropdown after IN THE KNOW ticker')
                        break
                    pos += 6
                else:
                    pos += 1
        else:
            print('   Could not find IN THE KNOW section')
    else:
        print('   Could not find ticker section')

# Also check if there was a previous version with className that might have gotten stripped
# Remove any broken/duplicate jurisdiction selectors that might exist in the header area  
# but keep our new one

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(app)

# Verify final state
with open('src/App.tsx', 'r', encoding='utf-8') as f:
    final = f.read()

if 'STATES DROPDOWN BAR' in final:
    print('   CONFIRMED: States dropdown is in the file')
    # Find the line number
    lines = final.split('\n')
    for i, line in enumerate(lines):
        if 'STATES DROPDOWN BAR' in line:
            print(f'   Located at line {i+1}')
            break
else:
    print('   WARNING: States dropdown still not found!')

print('\nDone. Ready for tsc check.')
