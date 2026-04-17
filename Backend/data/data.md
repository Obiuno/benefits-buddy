## Benefits Data

```yaml
benefits:
  - slug: universal-credit
    name: "Universal Credit"
    description: "Help with living costs if you're on low income or out of work"
    category: "income_support" # consider adding category column
    active: true
    # This section maps to your JSONB content column
    urls:
	    # gov url in the details for frontend, leave apply URL leave there
      gov_url: "https://www.gov.uk/universal-credit"
      apply_url: "https://www.gov.uk/apply-universal-credit"
    details: #change to learn_more for Sania
      is_legacy_replacement: true # consider fadding out flag as well
      eligibility:
        age_min: 18
        age_max: 66
        savings_threshold: 16000
        residency: "habitual_residence"
      documents_required: ["National Insurance number", "Bank account details", "Housing costs evidence"]
      gotchas: ["LISA counts toward savings threshold", "Partner income included if living together"]
      preparation_tips: ["Have last 3 payslips ready", "Check your NI number on a P60"]
      related_benefits: ["council_tax_reduction", "free_school_meals", "broadband_social_tariff"]
      questions_to_ask:
        - { id: housing_status, question: "Do you pay rent or have a mortgage?", type: "boolean" }
        - { id: savings_check, question: "Do you have more than £16,000 in savings?", type: "boolean" }
      glossary_terms: ["habitual_residence", "means_tested", "savings_threshold"]
  - slug: pension-credit
    name: "Pension Credit"
    description: "Extra money for low-income pensioners to bring weekly income up to a minimum amount."
    category: "income_support"
    active: true
    urls:
      gov_url: "https://www.gov.uk/pension-credit"
      apply_url: "https://www.gov.uk/pension-credit/how-to-claim"
    details:
      is_legacy_replacement: false # UC is for working age; this is for pension age
      eligibility:
        age_min: 66 # State Pension age
        age_max: null # No upper limit once you reach state pension age
        savings_threshold: 10000 # Savings over this may reduce the amount, but no hard £16k cutoff
        residency: "habitual_residence"
      documents_required: ["National Insurance number", "Information about income and savings", "Bank details"]
      gotchas: ["Mixed-age couples (one partner under 66) usually claim Universal Credit instead"]
      preparation_tips: ["Have details of any private pensions ready"]
      related_benefits: ["warm_home_discount", "winter_fuel_payment", "housing_benefit"]
      questions_to_ask:
        - { id: age_check, question: "Are you or your partner at State Pension age (66)?", type: "boolean" }
      glossary_terms: ["state_pension_age", "guarantee_credit", "mixed-age_couple"]
  # 3. CHILD BENEFIT (Support for parents/guardians)
  - slug: child-benefit
    name: "Child Benefit"
    description: "Monthly payments to people responsible for bringing up a child."
    category: "families_and_children"
    active: true
    urls:
      gov_url: "https://www.gov.uk/child-benefit"
      apply_url: "https://www.gov.uk/child-benefit/how-to-claim"
    details:
      is_legacy_replacement: false
      eligibility:
        child_age_max: 16 # or 20 if in education/training
        income_tax_threshold: 60000 # Tax applies over this amount
      documents_required: ["Child's birth certificate", "National Insurance number"]
      gotchas: ["If you earn over £80,000 you lose all benefit through tax"]
      related_benefits: ["guardian_allowance", "free_school_meals"]
      questions_to_ask:
        - { id: child_responsibility, question: "Are you responsible for a child under 16 (or 20 in education)?", type: "boolean" }
      glossary_terms: ["qualifying_young_person", "hmrc"]
  # 4. CARER'S ALLOWANCE (Support for regular carers)
  - slug: carers-allowance
    name: "Carer's Allowance"
    description: "Money for people who spend at least 35 hours a week caring for someone with a disability."
    category: "help_for_carers"
    active: true
    urls:
      gov_url: "https://www.gov.uk/carers-allowance"
      apply_url: "https://www.gov.uk/carers-allowance/how-to-claim"
    details:
      is_legacy_replacement: false
      eligibility:
        hours_per_week_min: 35
        earnings_limit_after_tax: 204 # Weekly earnings limit
      gotchas: ["The person you care for may see their own benefits reduce if you claim this"]
      questions_to_ask:
        - { id: caring_hours, question: "Do you provide care for at least 35 hours a week?", type: "boolean" }
      glossary_terms: ["habitual_residence", "severe_disability_premium"]
  # 5. FREE SCHOOL MEALS (Nutrition for students)
  - slug: free-school-meals
    name: "Free School Meals"
    description: "Ensures children in state-funded schools receive a free midday meal."
    category: "families_and_children"
    active: true
    urls:
      gov_url: "https://www.gov.uk/apply-free-school-meals"
      apply_url: "https://www.gov.uk/apply-free-school-meals"
    details:
      is_legacy_replacement: false
      eligibility:
        is_on_means_tested_benefits: true
      gotchas: ["Infants (Reception to Year 2) usually get these regardless of income"]
      questions_to_ask:
        - { id: schooling_child, question: "Do you have a child in a state-funded school?", type: "boolean" }
  # 6. ATTENDANCE ALLOWANCE (Care needs for over-65s)
  - slug: attendance-allowance
    name: "Attendance Allowance"
    description: "Support for people of pension age who have care needs due to disability."
    category: "disability_and_health"
    active: true
    urls:
      gov_url: "https://www.gov.uk/attendance-allowance"
      apply_url: "https://www.gov.uk/attendance-allowance/how-to-claim"
    details:
      is_legacy_replacement: false
      eligibility:
        age_min: 66
        care_needs_duration_months: 6 # Unless terminally ill
      gotchas: ["You cannot claim this if you already get PIP or DLA"]
      questions_to_ask:
        - { id: daily_help_needs, question: "Do you need frequent help with personal care or supervision?", type: "boolean" }
      glossary_terms: ["state_pension_age", "disability_benefit"]
  # 7. PIP - PERSONAL INDEPENDENCE PAYMENT (Disability support for adults)
  - slug: pip
    name: "Personal Independence Payment"
    description: "Help with extra costs caused by a long-term illness or disability."
    category: "disability_and_health"
    active: true
    urls:
      gov_url: "https://www.gov.uk/pip"
      apply_url: "https://www.gov.uk/pip/how-to-claim"
    details:
      is_legacy_replacement: false
      eligibility:
        age_min: 16
        age_max: 66
        condition_duration_months: 3
        expected_duration_months: 9
      gotchas: ["The amount depends on how your condition affects you, not the condition itself"]
      questions_to_ask:
        - { id: mobility_issues, question: "Does your condition make it hard for you to move around or daily tasks?", type: "boolean" }
      glossary_terms: ["work_capability_assessment", "mandatory_reconsideration"]
  # 8. HEALTHY START (Food and milk for families)
  - slug: healthy-start
    name: "Healthy Start"
    description: "A prepaid card to help buy milk, fruit, and vegetables for young families."
    category: "families_and_children"
    active: true
    urls:
      gov_url: "https://www.gov.uk/healthy-start"
      apply_url: "https://www.healthystart.nhs.uk/how-to-apply/"
    details:
      is_legacy_replacement: false
      eligibility:
        pregnancy_weeks_min: 10
        child_age_max: 4
        income_threshold_uc: 408 # Monthly threshold for UC claimants
      documents_required: ["National Insurance number", "Proof of children's identities"]
      gotchas: ["Not available in Scotland—use Best Start Foods instead"]
      questions_to_ask:
        - { id: income_check, question: "Is your monthly take-home pay £408 or less?", type: "boolean" }
  # 9. BUDGETING LOAN (Emergency essentials)
  - slug: budgeting-loan
    name: "Budgeting Loan"
    description: "An interest-free loan for essentials like clothes or furniture."
    category: "emergency_one_off"
    active: true
    urls:
      gov_url: "https://www.gov.uk/budgeting-help-benefits"
      apply_url: "https://www.gov.uk/budgeting-help-benefits/how-to-apply"
    details:
      is_legacy_replacement: false
      eligibility:
        qualifying_benefit_duration_months: 6 # Must be on specific benefits for 6 months
      gotchas: ["You cannot get this if you are on Universal Credit—apply for a Budgeting Advance instead"]
      preparation_tips: ["Check for existing Social Fund debt as this affects your loan amount"]
      questions_to_ask:
        - { id: uc_check, question: "Are you currently claiming Universal Credit?", type: "boolean" }
      glossary_terms: ["social_fund", "budgeting_advance"]
```

## FAQs Data

```yaml
faqs:
  - benefit_slug: universal-credit # related benefits
    category: "eligibility"
    question: "Can I claim if I am working?"
    answer: "Yes, Universal Credit is designed to support people on low incomes, including those in work."
    display_order: 1
    active: true
  - benefit_slug:
    category:
    question: "I’m working at the moment, am I still eligible for any help?"
    answer: "You’d be surprised how often the answer is yes. Many people think benefits are only for those out of work, but a huge amount of support (like Universal Credit) is actually designed to top up the income of people who are working but still find it hard to make ends meet."
    display_order:
    active: true
  - benefit_slug:
    category:
    question: "I have some money saved away for a rainy day. Does that mean I shouldn't bother checking?"
    answer: "Not at all. While some support looks at your savings, many other types of help (like those for children or disability) don't look at your bank balance at all. Even for the ones that do, you can often have up to £16,000 in savings before you’re unable to claim."
    display_order:
    active: true
  - benefit_slug:
    category:
    question: "I find the whole system really confusing. Where do I even begin?"
    answer: "It IS confusing, and that’s why many people miss out. A good first step is just talking through your situation, like whether you have children, care for someone, or have a health condition. To see which doors might be open for you try talking with our Benefits Buddy"
    display_order:
    active: true
  - benefit_slug:
    category:
    question: "Are there ways to lower my daily bills that aren't 'official' benefits?"
    answer: "Yes, and these are some of the most underclaimed bits of help out there. If you’re on a low income, you might be eligible for Social Tariffs, which are basically discounted rates for your broadband and water bills."
    display_order:
    active: true
  - benefit_slug:
    category:
    question: "I’m over 65, is there anything different for me?"
    answer: "Definitely. Once you reach state pension age, the system changes a bit. Instead of Universal Credit, you might look at things like Pension Credit to top up your income, or Attendance Allowance if you find you need a bit of extra help at home."
    display_order:
    active: true
  - benefit_slug:
    category:
    question: "If I find a benefit that looks right, what happens next?"
    answer: "We’ll point you directly to the right official GOV.UK page so you don't have to go hunting for it. We’ll also give you a simple list of the documents you’ll need—like your National Insurance number or bank details, so you can feel prepared before you start."
    display_order:
    active: true
  - benefit_slug:
    category:
    question: "I'm already on some older benefits. Will checking for new ones mess that up?"
    answer: "That's a really important question. Some older ‘legacy’ benefits are being replaced by Universal Credit. It's always worth checking if you'd be better off moving, but we'll always suggest you get a bit of expert advice before making a permanent switch."
    display_order:
    active: true
```

## Glossary data

```yaml
glossary:
  - glossary_slug: advanced_education
    term: "Advanced Education"
    definition: "Studying a course to get a degree, diploma or qualification."
    related_benefits:
  - glossary_slug: assessment_period
    term: "Assessment Period"
    definition: "A monthly period starting on the day you first make your Universal Credit claim."
    related_benefits:
  - glossary_slug: assessment_phase
    term: "Assessment Phase"
    definition: "The first part of your claim before you have a work capability assessment."
    related_benefits:
  - glossary_slug: benefit_cap
    term: "Benefit Cap"
    definition: "A limit on the total amount of benefits you can get."
    related_benefits:
  - glossary_slug: common_travel_area
    term: "Common Travel Area"
    definition: "The UK, Channel Islands and Isle of Man and the Republic of Ireland."
    related_benefits:
  - glossary_slug: contributory_benefit
    term: "Contributory Benefit"
    definition: "A benefit you can get if you have paid enough National Insurance contributions."
    related_benefits:
  - glossary_slug: defer_your_state_pension
    term: "Defer your State Pension"
    definition: "Choosing to wait to claim State Pension after you reach State Pension age, to get a higher weekly amount when you do claim."
    related_benefits:
  - glossary_slug: department_for_communities
    term: "Department for Communities (DCC)"
    definition: "The government department responsible for welfare and benefits in Northern Ireland."
    related_benefits:
  - glossary_slug: department_for_work_and_pensions_(DWP)
    term: "Department for Work and Pensions (DWP)"
    definition: "The government department responsible for welfare and benefits in Great Britain."
    related_benefits:
  - glossary_slug: disability_benefit
    term: "Disability Benefit"
    definition: "A benefit you can get if you have a disability or health condition that affects your ability to work."
    related_benefits:
  - glossary_slug: disability_living_allowance_(DLA)
    term: "Disability Living Allowance (DLA)"
    definition: "A benefit for people under 16 who have a disability or health condition that affects their ability to get around or care for themselves."
    related_benefits:
  - glossary_slug: dwp
    term: "Department for Work and Pensions (DWP)"
    definition: "The government department responsible for welfare and benefits in Great Britain."
    related_benefits:
  - glossary_slug: employment_and_support_allowance_(ESA)
    term: "Employment and Support Allowance (ESA)"
    definition: "A benefit for people who have a disability or health condition that affects their ability to work, and who are not eligible for Universal Credit."
    related_benefits:
  - glossary_slug: european_economic_area_(EEA)
    term: "European Economic Area (EEA)"
    definition: "The EU member states plus Iceland, Liechtenstein and Norway."
    related_benefits:
  - glossary_slug: european_union_(EU)
    term: "European Union (EU)"
    definition: "A political and economic union of 27 member states that are located primarily in Europe."
    related_benefits:
  - glossary_slug: financial_assessment
    term: "Financial Assessment"
    definition: "An assessment of your income and savings to determine how much Universal Credit you can get."
    related_benefits:
  - glossary_slug: hmrc
    term: "HMRC"
    definition: "Her Majesty's Revenue and Customs, the UK government department responsible for tax collection and administration of certain benefits."
    related_benefits:
  - glossary_slug: housing_benefit
    term: "Housing Benefit"
    definition: "A benefit to help with rent payments for people on a low income or claiming benefits."
    related_benefits:
  - glossary_slug: income_support
    term: "Income Support"
    definition: "A benefit for people who are on a low income and not required to look for work, such as carers or single parents with young children."
    related_benefits:
  - glossary_slug: jobseeker's_allowance_(JSA)
    term: "Jobseeker's Allowance (JSA)"
    definition: "A benefit for people who are unemployed and looking for work."
    related_benefits:
  - glossary_slug: legacy_benefit
    term: "Legacy Benefit"
    definition: "A benefit that has been replaced by a Universal Credit"
    related_benefits:
  - glossary_slug: local_housing_allowance
    term: "Local Housing Allowance"
    definition: "The amount of Housing Benefit you can get if you rent from a private landlord."
    related_benefits:
  - glossary_slug: managed_migration
    term: "Managed Migration"
    definition: "The process of moving people from legacy benefits to Universal Credit."
    related_benefits:
  - glossary_slug: mandatory_reconsideration
    term: "Mandatory Reconsideration"
    definition: "The process of asking for a benefit decision to be looked at again"
    related_benefits:
  - glossary_slug: mandatory_reconsideration_notice
    term: "Mandatory Reconsideration Notice"
    definition: "A letter from the DWP that explains the decision made after a mandatory reconsideration."
    related_benefits:
  - glossary_slug: minimum_income_floor
    term: "Minimum Income Floor"
    definition: "An assumed level of income for self-employed people that is used to calculate their Universal Credit payment."
    related_benefits:
  - glossary_slug: mixed-age_couple
    term: "Mixed-age Couple"
    definition: "A couple where one partner is under State Pension age and the other is over State Pension age."
    related_benefits:
  - glossary_slug: national_insurance_number
    term: "National Insurance Number"
    definition: "A unique number that you need to work and claim benefits in the UK."
    related_benefits:
  - glossary_slug: non-dependant
    term: "Non-dependant"
    definition: "A person who lives with you but is not financially dependent on you, such as an adult child or a partner."
    related_benefits:
  - glossary_slug: non_means-tested_benefit
    term: "Non means-tested Benefit"
    definition: "A benefit that you can get regardless of your income or savings, such as the State Pension."
    related_benefits:
  - glossary_slug: notional_income
    term: "Notional Income"
    definition: "An amount of income that the DWP assumes you have, even if you don't actually receive it, for the purpose of calculating your Universal Credit payment."
    related_benefits:
  - glossary_slug: overlapping_benefits
    term: "Overlapping Benefits"
    definition: "When you receive more than one benefit at the same time, and the DWP has to decide how to calculate your Universal Credit payment."
    related_benefits:
  - glossary_slug: presciribed_diseases
    term: "Prescribed Diseases"
    definition: "A list of diseases that are considered to be severe enough to qualify for certain benefits without a work capability assessment."
    related_benefits:
  - glossary_slug: private_tenancy
    term: "Private Tenancy"
    definition: "A rental agreement between a tenant and a private landlord."
    related_benefits:
  - glossary_slug: qualifying_young_person
    term: "Qualifying Young Person"
    definition: "Someone aged 16 or over but under 20 who meets a list of conditions"
    related_benefits:
  - glossary_slug: relevant_education
    term: "Relevant Education"
    definition: "Education that is full time and not advanced"
    related_benefits:
  - glossary_slug: severe_conditions
    term: "Severe Conditions"
    definition: "Having a lifelong, unchanging condition that makes you unable to work."
    related_benefits:
  - glossary_slug: social_housing_landlord
    term: "Social Housing Landlord"
    definition: "A local authority or housing association that provides social housing."
    related_benefits:
  - glossary_slug: social_security_Scotland
    term: "Social Security Scotland"
    definition: "The Scottish government agency responsible for administering certain benefits in Scotland."
    related_benefits:
  - glossary_slug: social_services
    term: "Social Services"
    definition: "The local authority department responsible for providing support and services to people in need, such as children, elderly people and people with disabilities."
    related_benefits:
  - glossary_slug: state_earnings_related_pension_scheme_(SERPS)
    term: "State Earnings Related Pension Scheme (SERPS)"
    definition: "A pension scheme that was in place in the UK from 1978 to 2002, which provided an additional pension based on your earnings."
    related_benefits:
  - glossary_slug: state_pension
    term: "State Pension"
    definition: "A regular payment from the government that you can get when you reach State Pension age, based on your National Insurance contributions."
    related_benefits:
  - glossary_slug: state_pension_age
    term: "State Pension Age"
    definition: "The age at which you can start claiming the State Pension, which is currently 66"
    related_benefits:
  - glossary_slug: surplus_income
    term: "Surplus Income"
    definition: "The amount of income you have left after your Universal Credit payment has been calculated, which may affect your eligibility for certain benefits or support."
    related_benefits:
  - glossary_slug: tax_credits
    term: "Tax Credits"
    definition: "A benefit that provides financial support to people on a low income, which has been replaced by Universal Credit for most people."
    related_benefits:
  - glossary_slug: tax_year
    term: "Tax Year"
    definition: "The period from 6 April to 5 April the following year, which is used for tax and benefit purposes."
    related_benefits:
  - glossary_slug: temporary_absence
    term: "Temporary Absence"
    definition: "When you are temporarily away from your home, such as for a holiday or hospital stay, which may affect your eligibility for certain benefits."
    related_benefits:
  - glossary_slug: universal_credit
    term: "Universal Credit"
    definition: "A benefit for people on a low income or out of work, which replaces several legacy benefits."
    related_benefits:
  - glossary_slug: universal_credit_full_service
    term: "Universal Credit Full Service"
    definition: "The version of Universal Credit that is currently being rolled out across the UK, which includes all the features and requirements of the benefit."
    related_benefits:
  - glossary_slug: work_capability_assessment
    term: "Work Capability Assessment"
    definition: "An assessment of your ability to work, which is used to determine your eligibility for certain benefits and the amount of Universal Credit you can get."
    related_benefits:
  - glossary_slug: working_age
    term: "Working Age"
    definition: "The age range during which you are expected to work and claim benefits if you are on a low income, which is currently 16 to State Pension age."
    related_benefits:
```
