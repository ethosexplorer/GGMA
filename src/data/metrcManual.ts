export interface MetrcSection {
  title: string;
  content: string;
  category: 'Overview' | 'Operations' | 'Admin' | 'Inventory' | 'Compliance';
}

export const METRC_MANUAL: MetrcSection[] = [
  {
    title: "Overview of Metrc",
    category: 'Overview',
    content: "Metrc stands for Marijuana Enforcement, Tracking, Reporting and Compliance. Metrc is a State Mandated Tracking and Reporting Software to chart your chain of custody for your Marijuana and Marijuana Infused Products from seed to sale. The Metrc™ Compliance Management System allows a licensee to track all the Marijuana inventory grown, processed, transferred, and sold for either medical or recreational use."
  },
  {
    title: "Life Cycle Summary",
    category: 'Operations',
    content: "1. Cuttings/clones identified as immature batch. 2. Immature plant becomes vegging plant (tagged). 3. Vegging plant becomes flowering (light cycle change). 4. Harvesting (wet weight). 5. Packaged inventory (buds, trim, infused). 6. Packaged inventory transferred to selling/infusing businesses."
  },
  {
    title: "License Permissions Matrix",
    category: 'Compliance',
    content: "Cultivator: Plants, Packages, Transfers, Admin. Processor: Packages, Transfers, Admin. Dispensary: Packages, Transfers, Sales, Patients, Admin. Testing Lab: Packages, Transfers, Admin."
  },
  {
    title: "Tag Orders & Management",
    category: 'Admin',
    content: "Tags are custom printed for each facility and are non-returnable. Orders can only be canceled before 7 pm CST on the day they are placed. Tags are ordered from the Admin → Tag Orders section. Available tab = tags ready to use. Used tab = tags already assigned. Voided tab = lost/damaged tags."
  },
  {
    title: "Location Management",
    category: 'Admin',
    content: "Locations are used to track where inventory is physically stored. Examples: 'Veg Location Section 1', 'Flower Room A', 'Dry Room'. Only Key Administrators can add/edit locations. Users can add multiple locations at once and discontinue old ones."
  },
  {
    title: "Real-Time Sales Reporting",
    category: 'Inventory',
    content: "A selling business will sell from packaged inventory. Information entered into the system inaccurately or in violation of the State’s rules or regulations could result in the States revocation of a Vendor’s API Key. Data should be entered on a transactional / real-time basis."
  },
  {
    title: "Plant Phase: Immature",
    category: 'Operations',
    content: "Cuttings, seedlings, or clones are grouped and identified as an immature batch. Key functions include: Create Plantings (permitted states only), Create Packages (seeds/immature plants for transfer), Change Growth Phase (to Vegetative), and Record Additives (fertilizers/pesticides)."
  },
  {
    title: "Plant Phase: Vegetative",
    category: 'Operations',
    content: "The second growth stage. Functions: Assign RFID Tags, Replace Tags, Change Location, and Change Growth Phase (to Flowering when light cycle changes to 12/12). Users can also Manicure Plants and Report Waste here."
  },
  {
    title: "Plant Phase: Flowering",
    category: 'Operations',
    content: "The third growth stage. Critical for harvesting. Functions: Harvest Plants (cut down and record wet weight), Record Additives, and Destroy Plants. Any light cycle shift to 12/12 must be reported."
  },
  {
    title: "Plant Phase: Harvested",
    category: 'Inventory',
    content: "The final phase. The plant has been cut down and wet weight recorded. Functions: Create Package, Submit for Testing, Report Waste, and Finish Batch (closing the harvest loop)."
  },
  {
    title: "Plant Item Detail (Audit History)",
    category: 'Compliance',
    content: "Clicking a Plant ID opens the full Event History. This is a complete immutable chain of custody including every movement, weight, strain change, additive, waste report, and harvest event for that specific plant."
  },
  {
    title: "Harvesting: Batch Creation",
    category: 'Operations',
    content: "Plants must be individually weighed and moved to the Harvest stage. A Harvest Batch name is required (Strain + Date recommended). There is no limit to the number of plants in a batch. Once harvested, a total wet weight is recorded for the batch."
  },
  {
    title: "Harvest: Package Creation",
    category: 'Inventory',
    content: "Packages of Bud (flower), Shake, or Trim are created directly from the Harvested tab (not the packages menu). This links the package to its source batch. As packages are created, the total wet weight of the harvest batch decreases."
  },
  {
    title: "Harvest: Moisture Loss & Finishing",
    category: 'Compliance',
    content: "When a harvest batch is 'Finished', any remaining weight is attributed to moisture loss (evaporation during curing). There should almost always be weight left in a harvest batch for this purpose. Once finished, a batch can only be 'Unfinished' from the Inactive tab."
  },
  {
    title: "Harvest: Waste & Testing",
    category: 'Operations',
    content: "Waste (wet or dry) must be reported on the day it is created. Testing samples can be pulled from the harvest batch or individual packages depending on state rules. RFID tags must be assigned to every testing sample package."
  },
  {
    title: "Harvest: The 48-Hour Rule",
    category: 'Compliance',
    content: "A harvest may only be discontinued (reversing plants back to Flowering state) if it was created less than 48 hours ago AND no waste has been reported or packages created."
  },
  {
    title: "Package Fundamentals",
    category: 'Inventory',
    content: "The Package ID is the only way to move product. To move any item, it must be in a package. There are three states: Active (in facility), On Hold (Administrative hold by state), and Inactive (finished or discontinued)."
  },
  {
    title: "Re-packaging & Splitting",
    category: 'Operations',
    content: "New packages can be created from existing packages (re-packaging) or by splitting one large package into multiple smaller ones. Multi-source packaging allows combining multiple existing packages into one new infused product or batch."
  },
  {
    title: "Package Adjustments (Rules)",
    category: 'Compliance',
    content: "Adjustments are for physical conflicts (theft, loss, moisture), NOT for sales or re-packaging. Users must select a State-approved reason and enter the new quantity. Once a package is Discontinued, it is permanent and cannot be reversed."
  },
  {
    title: "Processor & Infused Workflow",
    category: 'Operations',
    content: "Processors must create intermediate packages for concentrates before infusing them into final products. This allows for accurate recording of contents in the finished infused product package. Each step creates a new chain of custody link."
  },
  {
    title: "Source Production Batch",
    category: 'Compliance',
    content: "The Source Production Batch Numbers field identifies which original harvest or production batch a package came from. This is critical for recall accuracy, ensuring a contaminated source can be traced through all its derived packages."
  },
  {
    title: "Strain Management (Admin)",
    category: 'Admin',
    content: "Strains are the primary identifiers for plants and packages. They are created under Admin → Strains. Required: Strain Name. Optional: THC/CBD content, Indica/Sativa makeup, and Testing Status. Organizations with multiple facilities can push strains to all locations at once."
  },
  {
    title: "Strain: The 'Used' Lockdown Rule",
    category: 'Compliance',
    content: "Once a strain has been used (assigned to any plant or package), it can no longer be edited. This ensures the integrity of the chain of custody. If a strain is no longer needed, it must be 'Discontinued' using the (X) button, which removes it from the active list for that facility."
  },
  {
    title: "Strain: Error Correction",
    category: 'Operations',
    content: "If an incorrect strain was assigned to a plant or batch, users can use the 'Change Strain' button. Note: Changing an immature batch's strain will NOT update plants that have already transitioned to a new growth phase (Vegetative/Flowering). For older plants, use the template to update multiple IDs at once."
  },
  {
    title: "Sales Reporting Fundamentals",
    category: 'Inventory',
    content: "All sales must be recorded in Metrc to maintain the chain of custody. Methods: Manual Entry, CSV Import, or API (POS Integration). Required data: Date/Time of sale, Customer Type (Patient/Consumer), Package ID, Quantity, and Price."
  },
  {
    title: "Sales: Manual Entry SOP",
    category: 'Operations',
    content: "Dispensaries use 'Record Receipts' to enter sales. Users must enter the Package ID, verify availability, and specify the patient/caregiver numbers if applicable. Multiple receipts can be entered simultaneously using the '+' button."
  },
  {
    title: "Sales: CSV & API Integration",
    category: 'Admin',
    content: "POS vendors use the API to push sales in real-time. If API is not used, CSV uploads are required. Note: CSV uploads are permanent once imported and cannot be removed. Files are limited to 1MB and are scanned for viruses."
  },
  {
    title: "Sales: Finalizing & Performance",
    category: 'Compliance',
    content: "Periodically, users should 'Finalize' receipts to improve system performance. This is recommended once receipts exceed 50,000. Finalized receipts can be 'Unfinalized' for editing if necessary. Users can bulk-finalize up to 100 receipts at once."
  },
  {
    title: "Item Definition & Master Data",
    category: 'Admin',
    content: "Items are the physical products (SKUs) sold or processed. Every package must be associated with an Item. Required: Item Name, Category, and Unit of Measure (UoM). Items can be strain-specific (e.g., flower) or non-strain-specific (e.g., hardware/merch)."
  },
  {
    title: "Item: Categorization & Rules",
    category: 'Compliance',
    content: "Item categories must match state-mandated rules for accurate reporting. Once an item has been used in a transaction (sale or transfer), it cannot be edited. This preserves the integrity of the state tracking record. Organizations can push item lists to multiple facilities simultaneously."
  },
  {
    title: "Item Detail & Audit Trail",
    category: 'Compliance',
    content: "The Item Detail area provides the complete history of a SKU. It aggregates all packages created from that item, every transfer manifest it appeared on, and every sales receipt where it was sold. This is the ultimate tool for reconcilement and facility-wide audits."
  },
  {
    title: "Transfer Fundamentals & Manifests",
    category: 'Operations',
    content: "Any movement between licenses requires a transfer and a Metrc-generated manifest. This includes transfers between facilities in the same building. A package must exist before it can be transferred. Manifests must be printed for the driver and saved as a PDF."
  },
  {
    title: "Creating a Transfer",
    category: 'Operations',
    content: "Required: Destination, Planned Route, Departure/Arrival Estimates, Driver Name/ID, License Plate, and Vehicle Make/Model. All information must be accurate before 'Registering' the transfer. Transfers can be modified or voided ONLY before departure."
  },
  {
    title: "Receiving & Rejections SOP",
    category: 'Compliance',
    content: "Recipients must verify contents before clicking 'Receive'. Once clicked, legal responsibility shifts to the receiver. Partial package receipts are NOT allowed. If there is a discrepancy, the package should be 'Rejected', requiring the originator to receive it back into their custody."
  },
  {
    title: "Scale Variance & Weight Exceptions",
    category: 'Compliance',
    content: "Recipients can report a new weight only for scale variance or unit conversion (e.g., lbs to grams). Reporting a different weight raises a 'State Exception' flag. If the discrepancy is significant, rejecting the package is the safest compliance path."
  },
  {
    title: "Voiding & Responsibilities",
    category: 'Admin',
    content: "Only the originator can void a transfer. Voiding permanently eliminates the manifest and returns the packages to the originator's active inventory. A transfer cannot be modified once the departure time has passed or the process has begun."
  },
  {
    title: "Waste Reporting Fundamentals",
    category: 'Compliance',
    content: "Waste reporting is required any time product is destroyed, lost, or removed from inventory. It must be reported in real-time on the SAME DAY it occurs. All waste must be reconciled daily to maintain state compliance."
  },
  {
    title: "Waste: Real-Time Legal Mandate",
    category: 'Compliance',
    content: "Waste must never be batched at the end of the week. Inaccurate or delayed reporting can result in audits or revocation of API access. Moisture loss during drying is NOT recorded as waste; it is automatically handled during the 'Finish Batch' process."
  },
  {
    title: "Waste: Valid Reasons",
    category: 'Operations',
    content: "Users must select a state-approved reason: Damage/Spoilage, Disease/Infestation, Mandatory State Destruction, Trimming/Pruning, or Theft/Diversion/Loss. 'Other' requires a detailed explanation note."
  },
  {
    title: "Waste: Discontinuing (Error Correction)",
    category: 'Admin',
    content: "If waste was reported in error, it can be discontinued (reversed) from the Harvested tab ONLY if no packages have been created from that batch and the batch has not been finished. Once discontinued, the weight is added back to the active batch."
  },
  {
    title: "Additives & Chemical Tracking",
    category: 'Operations',
    content: "Additives include fertilizers, pesticides, and fungicides. Recording is mandatory for traceability and consumer safety. Additive history is visible in the plant detail screen, providing a permanent audit trail for every substance applied."
  },
  {
    title: "Additive Reporting SOP",
    category: 'Operations',
    content: "Available in Immature, Vegetative, and Flowering phases. Required: Additive Name, Quantity, Unit of Measure, and Date Applied. Information must be recorded on the SAME DAY as the application to remain in compliance."
  },
  {
    title: "Consumer Safety & Audits (Additives)",
    category: 'Compliance',
    content: "Accurate additive logs are critical for pesticide tracking and safety audits. In the event of a lab failure (e.g., failed microbials or heavy metals), the state will cross-reference the plant's additive history to identify the source of contamination."
  },
  {
    title: "Data Exploration & Filtering",
    category: 'Admin',
    content: "Metrc allows for deep data searching via Column Sorting and Column Filters. Users can refine views by variables like 'Is equal to', 'Starts with', 'Contains', and 'Ends with'. This is the primary method for finding specific tag numbers or transaction records."
  },
  {
    title: "Advanced Search Logic (And/Or)",
    category: 'Admin',
    content: "The 'And/Or' parameters allow for multi-variable refined searches. Example: Finding all transfers in a specific month AND from a specific facility. Note: Metrc search functions do NOT allow for wild cards (*). Users must use exact or partial string matching."
  },
  {
    title: "Search Hygiene & Integrity",
    category: 'Compliance',
    content: "Always use the 'Clear' button before starting a new query to ensure results are not filtered by previous parameters. Proper filtering is required for generating accurate compliance reports and responding to state investigations."
  },
  {
    title: "RFID Technology & Protocol",
    category: 'Admin',
    content: "Metrc uses EPC Class 1 Gen 2 (ISO18000 part 6) RFID tags. Each tag contains an RFID chip, antenna, and substrate (inlay). Tags are pre-programmed and assigned specifically to one facility license. They are non-transferable and cannot be reassigned to another business."
  },
  {
    title: "Plant Tags vs. Package Tags",
    category: 'Inventory',
    content: "Plant Tags (Yellow for Medical, Blue for Retail) track plants from Immature phase to Harvest. Package Tags are pressure-sensitive labels used for all transfers and final products. Every tag displays the facility name, license number, order date, and a unique 24-digit ID."
  },
  {
    title: "Tag Ordering & Security Rules",
    category: 'Compliance',
    content: "Tags are ordered under Admin → Tag Orders. They arrive in numeric order and are automatically loaded into the Metrc account. Using a tag that does not correspond to the digital record is a major compliance violation. Package tags are mandatory for all transfers out of a facility."
  },
  {
    title: "Laboratory Testing & Safety",
    category: 'Compliance',
    content: "Testing is the mandatory safety gate for all products. It can be initiated from the Harvested or Packages tabs. Submitting for testing creates a 'Test Sample' package with its own RFID tag, which must be sent to a licensed OMMA testing lab."
  },
  {
    title: "Testing: Administrative Hold SOP",
    category: 'Compliance',
    content: "Once a sample is submitted, the source package is placed on an Administrative Hold. It cannot be sold or transferred until the lab enters a 'Passed' result. This ensures contaminated or untested products never reach consumers."
  },
  {
    title: "Testing: Lab Result Recording",
    category: 'Admin',
    content: "Only licensed labs can record test results; cultivators and processors have no edit access to results. Labs use the API or lab login to upload findings. Once recorded, the package status is automatically updated in the facility's inventory."
  },
  {
    title: "Failed Tests & Remediation",
    category: 'Compliance',
    content: "Packages that fail mandatory testing panels (e.g., pesticides, heavy metals) must be destroyed or undergo state-approved remediation/re-testing. Failure to follow remediation protocols is a high-level enforcement trigger."
  },
  {
    title: "The Metrc Key Administrator (System Owner)",
    category: 'Admin',
    content: "The Key Administrator is the most powerful role in Metrc. They are the 'System Owner' responsible for adding facilities, locations, and employees. Only the Key Admin can order RFID tags, manage strains/items, and grant/revoke permissions for other users. Without a properly set-up Key Administrator, a facility cannot operate in Metrc."
  },
  {
    title: "Key Admin: Appointment & Credentialing",
    category: 'Admin',
    content: "To become a Key Admin, the owner must complete Metrc training and email support@metrc.com with the Business License, Owner Badge Number, and Email. Metrc support usually responds within 3 business days. Note: The owner must also be added as a regular employee with full permissions to perform daily tasks."
  },
  {
    title: "Key Admin: High-Level Oversight",
    category: 'Compliance',
    content: "The Key Admin is the primary point of contact for state regulators on setup and credentialing issues. All other employees receive a 'Welcome to Metrc' email ONLY after the Key Administrator adds them. This role is mandatory for every licensed facility to maintain compliance and chain of custody."
  },
  {
    title: "Facility Management (Aliases & Legal)",
    category: 'Admin',
    content: "Only the Key Administrator can add/edit facilities. While the Legal Name is immutable (comes from the state database), facilities can have 'Aliases' or nicknames visible only to the organization. Multiple facilities can be managed from a single admin account."
  },
  {
    title: "Employee Access & Security",
    category: 'Compliance',
    content: "Admins can add, edit, lock, unlock, or disable employees. Each employee must have unique permissions based on their role. If an employee's badge is revoked or they are terminated, they must be disabled in Metrc immediately to prevent unauthorized inventory access."
  },
  {
    title: "The Digital Tag Reception",
    category: 'Operations',
    content: "When physical tags arrive via UPS, they must be 'Digitally Received' in the Admin → Tag Orders screen. This moves the tags from 'Ordered' to 'Available' status. Tags are non-returnable and assigned to one facility only."
  },
  {
    title: "Metrc Fundamentals (FAQ)",
    category: 'Overview',
    content: "Metrc is an enforcement tool developed to track inventory within a closed-loop regulatory scheme. It is a cloud-based solution accessible via any device with internet. It is NOT a patient database; it is an inventory and chain-of-custody tool."
  },
  {
    title: "Access & Hardware Requirements",
    category: 'Admin',
    content: "No specialized RFID or Barcode scanners are required to use Metrc; the system is designed to be operated with a mouse only. Tag ID numbers are auto-populated in your account when ordered, so manual entry of 24-digit codes is never required."
  },
  {
    title: "Patient Privacy & Sale Tracking",
    category: 'Compliance',
    content: "Metrc does not store personal patient data. Tracking ends at the point of sale to a private citizen. The system generates manifests for transportation between licenses, but does not follow the product into the consumer's home."
  },
  {
    title: "Troubleshooting: Expired Links",
    category: 'Admin',
    content: "The common error 'I can no longer use this key' occurs when a user clicks an expired welcome email link (valid for 24 hours). Users should instead navigate directly to the state URL (e.g., ok.metrc.com) and use the credentials they initially established."
  },
  {
    title: "Glossary: Plant Life & Growth",
    category: 'Operations',
    content: "Flowering: The reproductive state with a 12/12 light cycle. Vegetative: The growth state before resin production. Immature Batch: Groups of clones/seedlings. Live Plant: Any plant in Immature, Veg, or Flower phases. Harvest: The act of cutting down and weighing a flowering plant."
  },
  {
    title: "Glossary: Products & Inventory",
    category: 'Inventory',
    content: "Package: A tagged container of product. Concentrate/Hash/Kief: Various forms of processed resin. Infused Product: Non-smokable items sold by quantity. Production Batch: A group of packages from a single production run. Shake/Buds: Harvested parts of the plant."
  },
  {
    title: "Glossary: Business & Logistics",
    category: 'Admin',
    content: "Transfer: Change in custody between licensees. Wholesale Transfer: Change in both custody AND ownership. Transportation Manifest: The digital/physical document detailing a transfer. Licensee: Any person or business registered with the State."
  },
  {
    title: "Glossary: Metrc Roles & Tech",
    category: 'Compliance',
    content: "Metrc User: Any person granted access for tracking. Metrc Trained Administrator: An owner or employee who has completed state training. RFID (Radio Frequency Identification): The wireless capture tech used to identify tags via chip and antenna."
  }
];
