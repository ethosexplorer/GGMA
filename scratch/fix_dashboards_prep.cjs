const fs = require('fs');

// --- Fix AttorneyDashboard ---
let attr = fs.readFileSync('src/pages/AttorneyDashboard.tsx', 'utf8');

// Remove the corrupted trailing divs and fix structure
// We want to insert the reviews section before the end of the main content area
const attorneyReviews = `
                {/* Client Reviews & Ratings */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        <UserCheck size={20} className="text-[#1a4731]" /> Client Reviews & Ratings
                      </h3>
                      <p className="text-sm text-slate-500">Top-rated attorneys receive "Top Counsel" acknowledgement.</p>
                    </div>
                    <div className="bg-[#1a4731] text-white px-3 py-1 rounded-lg text-sm font-bold">
                      A+ Rating (4.9/5)
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="font-bold text-slate-800">GreenLeaf LLC</p>
                      <p className="text-sm text-slate-600">"Alex was incredibly fast and handled our entire state compliance application within 24 hours."</p>
                    </div>
                  </div>
                </div>
`;

// Find the last compliance module button and insert after it
attr = attr.replace(
    '<ChevronRight size={16} className="text-slate-400 group-hover:text-blue-500" />\n                    </button>\n                  </div>\n                </div>',
    '<ChevronRight size={16} className="text-slate-400 group-hover:text-blue-500" />\n                    </button>\n                  </div>\n                </div>' + attorneyReviews
);

// Fix the trailing divs (count should be: 48, 114, 141, 142)
// Current end looks like:
/*
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
*/
// Let's replace it with a clean set
attr = attr.replace(
    /<\/div>\s+<\/div>\s+<\/div>\s+<\/div>\s+<\/div>\s+<\/div>\s+<\/div>\s+<\/div>\s+<\/div>\s+<\/div>/g,
    '</div></div></div></div></div>'
); // This is risky, let's use a better anchor.

// I'll just rewrite the whole return block for AttorneyDashboard to be sure
// Actually, let's just fix the end of the file precisely.
const attorneyEnd = `
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
`;
// find where 142 closes
const lastModuleClose = attr.lastIndexOf('</div>\n                </div>');
if (lastModuleClose !== -1) {
    // This is hard. Let's just use replace_file_content tool for the specific blocks.
}

// --- Fix ProviderDashboard ---
let prov = fs.readFileSync('src/pages/ProviderDashboard.tsx', 'utf8');
// (Same logic)

// Actually, I'll just use the replace_file_content tool directly in the next turn to fix the files.
// It's safer than a script for complex JSX balancing.
