-- Clear existing products
delete from "public"."products";

-- Insert Life Biotech product range
insert into "public"."products" (
    "name",
    "description",
    "composition",
    "form",
    "price",
    "stock"
) values
    (
        'D3Lite-60K',
        'High-potency Vitamin D3 supplement for bone health and immunity',
        'Cholecalciferol 60000 IU',
        'Softgel Capsule',
        149.99,
        100
    ),
    (
        'Templow-TH4',
        'Pain relief and inflammation reduction medication',
        'Aceclofenac 100mg & Thiocolchicoside 4mg',
        'Tablet',
        89.99,
        150
    ),
    (
        'Life Vit 9G',
        'Comprehensive multivitamin and mineral supplement',
        'Lycopene, Multivitamin, Multimineral',
        'Syrup',
        199.99,
        75
    ),
    (
        'Templow-TH8',
        'Advanced pain management formula',
        'Aceclofenac 100mg & Thiocolchicoside 8mg',
        'Tablet',
        99.99,
        150
    ),
    (
        'Kalci-GOLD',
        'Calcium supplement with Vitamin D3 for bone strength',
        'Calcium Citrate 1200mg, Vitamin D3 1000 IU',
        'Tablets',
        179.99,
        100
    ),
    (
        'Templow-AP',
        'Combination pain relief medication',
        'Aceclofenac 100mg & Paracetamol 325mg',
        'Tablet',
        79.99,
        200
    ),
    (
        'Methylpre-NT',
        'Neurological health supplement',
        'Pregabalin, Nortriptyline & Mecobalamin',
        'Tablets',
        249.99,
        80
    ),
    (
        'Templow-SP',
        'Advanced inflammation and pain management',
        'Aceclofenac 100mg & Serratiopeptidase 15mg',
        'Tablet',
        129.99,
        120
    ),
    (
        'Lifepan-40',
        'Digestive health medication',
        'Pantoprazole Gastro-Resistant',
        'Tablets',
        159.99,
        100
    ),
    (
        'Orthokq',
        'Joint and muscle pain relief',
        'Diclofenac Diethylamine, Methyl Salicylate & Menthol',
        'Oil',
        129.99,
        50
    ),
    (
        'RG Care',
        'Digestive health supplement',
        'Probiotic Formula with Digestive Enzymes',
        'Tablet',
        189.99,
        90
    ),
    (
        'LMox-CV.LB',
        'Broad-spectrum antibiotic combination',
        'Amoxicilline 500mg, Clavulanic Acid 125 mg & Lactic Acid Bacillus',
        'Tablet',
        299.99,
        60
    ),
    (
        'Lifer-XT',
        'Iron supplement with folic acid',
        'Ferrous Ascorbate 100mg + Folic Acid 1500 mcg',
        'Tablet/Syrup',
        139.99,
        100
    ),
    (
        'KG.Cort-6',
        'Anti-inflammatory medication',
        'Deflazacort 6mg',
        'Tablets',
        219.99,
        70
    ),
    (
        'PN-40',
        'Acid reflux and ulcer treatment',
        'Pantoprazole 40 mg',
        'Injection',
        399.99,
        40
    ),
    (
        'Life-Cef',
        'Broad-spectrum antibiotic treatment',
        'Cefoperazone & Sulbactam 1.5gm',
        'Injection',
        599.99,
        30
    );

-- Update the contact information in case needed later
comment on table "public"."products" is 'Life Biotech Products - Contact: info@lifebiotech.org, Address: Plot No. 120, Vishwapriya Nagar, Bengur, Bengaluru, Karnataka';