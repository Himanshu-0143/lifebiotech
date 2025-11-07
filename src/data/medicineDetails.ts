import { MedicineDetails } from '@/types/medicine';

export const medicineDetails: Record<string, MedicineDetails> = {
  'D3Life-60K': {
    indications: [
      'Vitamin D deficiency',
      'Prevention and treatment of osteoporosis',
      'Improvement of bone mineral density',
      'Support for calcium absorption'
    ],
    contraindications: [
      'Hypercalcemia',
      'Severe renal impairment',
      'Vitamin D hypersensitivity'
    ],
    sideEffects: [
      'Hypercalcemia',
      'Kidney stones (with long-term use)',
      'Gastrointestinal disturbances',
      'Headache (rare)'
    ],
    dosage: 'One capsule (60,000 IU) weekly or as directed by the physician',
    storage: 'Store in a cool, dry place below 30°C. Protect from direct sunlight.'
  },
  'Templow-TH4': {
    indications: [
      'Muscular pain and inflammation',
      'Osteoarthritis',
      'Rheumatoid arthritis',
      'Muscle spasms'
    ],
    contraindications: [
      'Peptic ulcer',
      'Severe hepatic impairment',
      'Pregnancy and lactation',
      'History of hypersensitivity to NSAIDs'
    ],
    sideEffects: [
      'Gastrointestinal disturbances',
      'Dizziness',
      'Drowsiness',
      'Skin reactions (rare)'
    ],
    dosage: 'One tablet twice daily after meals',
    storage: 'Store below 30°C in a dry place. Protect from light and moisture.'
  },
  'Life Vit 9G': {
    indications: [
      'General vitamin and mineral supplementation',
      'Nutritional deficiencies',
      'Antioxidant support',
      'Immune system support'
    ],
    contraindications: [
      'Known hypersensitivity',
      'Not recommended for children under 12'
    ],
    sideEffects: [
      'Mild gastrointestinal discomfort',
      'Change in urine color (harmless)',
      'Nausea in sensitive individuals'
    ],
    dosage: '10ml twice daily with meals or as directed by physician',
    storage: 'Store in a cool, dry place. Protect from direct sunlight.'
  },
  'Templow-TH8': {
    indications: [
      'Severe muscular pain',
      'Acute back pain',
      'Post-operative pain',
      'Severe muscle spasms'
    ],
    contraindications: [
      'Severe liver disease',
      'Active gastrointestinal bleeding',
      'Pregnancy and lactation',
      'History of NSAID-induced asthma'
    ],
    sideEffects: [
      'Gastrointestinal effects',
      'Dizziness',
      'Drowsiness',
      'Liver function changes (rare)'
    ],
    dosage: 'One tablet twice daily after meals',
    storage: 'Store below 30°C. Protect from light and moisture.'
  },
  'Life Vit': {
    indications: [
      'Multivitamin supplementation',
      'Growth and development support',
      'Immune system enhancement',
      'General wellness'
    ],
    contraindications: [
      'Known hypersensitivity to ingredients',
      'Not for children under 2 years'
    ],
    sideEffects: [
      'Mild stomach upset',
      'Temporary urine color change',
      'Taste alterations (rare)'
    ],
    dosage: '5-10ml twice daily or as directed by physician',
    storage: 'Store in a cool, dry place below 25°C. Protect from direct sunlight.'
  },
  'KALCI-GOLD': {
    indications: [
      'Calcium deficiency',
      'Osteoporosis prevention',
      'Post-menopausal bone health',
      'Growing children and adolescents'
    ],
    contraindications: [
      'Hypercalcemia',
      'Severe kidney disease',
      'Kidney stones'
    ],
    sideEffects: [
      'Constipation',
      'Bloating',
      'Kidney stones (with long-term high doses)'
    ],
    dosage: 'One tablet daily or as directed by physician',
    storage: 'Store at room temperature (15-30°C). Keep container tightly closed.'
  },
  'Templow-AP': {
    indications: [
      'Moderate to severe pain',
      'Fever',
      'Inflammatory conditions',
      'Post-operative pain'
    ],
    contraindications: [
      'Active peptic ulcer',
      'Severe liver disease',
      'Known hypersensitivity',
      'Third trimester of pregnancy'
    ],
    sideEffects: [
      'Gastric irritation',
      'Nausea',
      'Dizziness',
      'Skin reactions (rare)'
    ],
    dosage: 'One tablet thrice daily after meals',
    storage: 'Store below 30°C in a dry place. Protect from light.'
  },
  'Methylpre-NT': {
    indications: [
      'Neuropathic pain',
      'Diabetic neuropathy',
      'Depression with nerve pain',
      'Vitamin B12 deficiency'
    ],
    contraindications: [
      'Known hypersensitivity',
      'Severe kidney disease',
      'Pregnancy and lactation'
    ],
    sideEffects: [
      'Drowsiness',
      'Dizziness',
      'Dry mouth',
      'Weight gain'
    ],
    dosage: 'One tablet at bedtime or as directed by physician',
    storage: 'Store in a cool, dry place below 30°C.'
  },
  'Templow-SP': {
    indications: [
      'Post-operative inflammation',
      'Chronic inflammatory conditions',
      'Sports injuries',
      'Musculoskeletal disorders'
    ],
    contraindications: [
      'Bleeding disorders',
      'Pre-surgery',
      'Peptic ulcer',
      'Pregnancy'
    ],
    sideEffects: [
      'Gastrointestinal disturbances',
      'Bleeding tendency',
      'Allergic reactions',
      'Dizziness'
    ],
    dosage: 'One tablet twice daily after meals',
    storage: 'Store below 30°C. Protect from light and moisture.'
  },
  'Lifepan-40': {
    indications: [
      'Gastric ulcers',
      'GERD',
      'Acid reflux',
      'Zollinger-Ellison syndrome'
    ],
    contraindications: [
      'Known hypersensitivity',
      'Severe liver disease'
    ],
    sideEffects: [
      'Headache',
      'Diarrhea',
      'Nausea',
      'Stomach pain'
    ],
    dosage: 'One tablet once daily before breakfast',
    storage: 'Store below 25°C. Protect from moisture.'
  },
  'Orthokq': {
    indications: [
      'Joint pain',
      'Muscle pain',
      'Sprains',
      'Sports injuries'
    ],
    contraindications: [
      'Open wounds',
      'Broken skin',
      'Known hypersensitivity'
    ],
    sideEffects: [
      'Skin irritation',
      'Burning sensation',
      'Redness',
      'Rash (rare)'
    ],
    dosage: 'Apply 2-3 times daily on affected area',
    storage: 'Store in a cool place below 30°C.'
  },
  'RG Care': {
    indications: [
      'Digestive disorders',
      'Gut health maintenance',
      'Antibiotic-associated diarrhea prevention',
      'IBS symptoms'
    ],
    contraindications: [
      'Hypersensitivity to ingredients',
      'Severe immunodeficiency'
    ],
    sideEffects: [
      'Mild bloating initially',
      'Temporary gas',
      'Mild stomach discomfort'
    ],
    dosage: 'One tablet twice daily with meals',
    storage: 'Store below 25°C in a dry place.'
  },
  'LMox-CV.LB': {
    indications: [
      'Bacterial infections',
      'Respiratory tract infections',
      'Skin infections',
      'ENT infections'
    ],
    contraindications: [
      'Penicillin allergy',
      'Severe liver disease',
      'Mononucleosis'
    ],
    sideEffects: [
      'Diarrhea',
      'Nausea',
      'Rash',
      'Allergic reactions'
    ],
    dosage: 'One tablet twice daily for 5-7 days or as prescribed',
    storage: 'Store below 25°C. Protect from light and moisture.'
  },
  'Lifer-XT': {
    indications: [
      'Iron deficiency anemia',
      'Pregnancy supplementation',
      'Post-surgery recovery',
      'Chronic blood loss'
    ],
    contraindications: [
      'Iron overload',
      'Hemochromatosis',
      'Active ulcers'
    ],
    sideEffects: [
      'Constipation',
      'Black stools',
      'Nausea',
      'Stomach pain'
    ],
    dosage: 'One tablet daily or as directed by physician',
    storage: 'Store in a cool, dry place below 30°C.'
  },
  'KG.Cort-6': {
    indications: [
      'Severe inflammation',
      'Autoimmune conditions',
      'Allergic disorders',
      'Skin conditions'
    ],
    contraindications: [
      'Systemic infections',
      'Live vaccines',
      'Peptic ulcer'
    ],
    sideEffects: [
      'Weight gain',
      'Mood changes',
      'Increased blood sugar',
      'Bone density reduction'
    ],
    dosage: 'As prescribed by physician, typically one tablet daily',
    storage: 'Store below 25°C. Protect from light.'
  },
  'PN-40': {
    indications: [
      'Severe acid reflux',
      'Acute ulcer treatment',
      'Pre-surgery acid reduction',
      'Zollinger-Ellison syndrome'
    ],
    contraindications: [
      'Known hypersensitivity',
      'Severe liver disease'
    ],
    sideEffects: [
      'Injection site reaction',
      'Headache',
      'Dizziness',
      'Nausea'
    ],
    dosage: 'One vial (40mg) daily or as prescribed',
    storage: 'Store below 25°C. Protect from light.'
  },
  'Life-Cef': {
    indications: [
      'Severe bacterial infections',
      'Hospital-acquired infections',
      'Complicated UTIs',
      'Respiratory infections'
    ],
    contraindications: [
      'Beta-lactam allergy',
      'Severe kidney disease',
      'Pregnancy (unless vital)'
    ],
    sideEffects: [
      'Injection site pain',
      'Allergic reactions',
      'Gastrointestinal disturbances',
      'Blood count changes'
    ],
    dosage: 'As prescribed by physician, typically 1-2 times daily',
    storage: 'Store below 25°C. Protect from light. Reconstitute before use.'
  }
};