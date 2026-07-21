export type Venture = { name:string; sector:string; status:string; problem:string; solution:string; benefit:string; focus:string };
export const stats = [
  ["1.5M","farmer households targeted"],["49%","farmer ownership target"],["378,500","farmer records collected"],
  ["4–6","scalable ventures in five years"],["30%","targeted household income improvement"],["5–7 yrs","IPO ambition"]
];
export const leaders = [
  ["Mr. Keshav Sthapit","Chairman","Keshav Sthapit.png"],["Mr. Surya Bhusal","Board Member","surya bhusal.jpeg"],
  ["Mr. Minraj Kadel","Board Member","Mr Minraj Kandel.jpg"],["Mr. Keshav Lal Shrestha","Board Member","Keshav Lal Shrestha.jpeg"],
  ["Mrs. Shobha Gyawali","Board Member","sobha gyawali.jpg"],["Mr. Mahesh Gyawali","Board Member","Mahesh Gyawali.png"],
  ["Mr. Keshav Sarawagi","Board Member","Mr Keshav Sarawagi.png"],["Mr. Bal Kumar Thapaliya","Board Member","Mr Bal Kumar Thapaliya.jpg"],
  ["Mrs. Bhagwati Choudhary","Board Member","Mrs . Bhagwati Choudhary.png"],["Mr. Lal Prasad Sanwa Limbu","Advisor","Mr . Lal Prasad Sanwa Limbu.jpg"]
];
export const ventures: Venture[] = [
  {name:"Kisan Net",sector:"Digital Infrastructure",status:"Flagship",problem:"Rural communities face uneven access to reliable connectivity and digital services.",solution:"An integrated FTTH, wireless broadband and farmer-focused digital platform.",benefit:"Market information, telehealth, e-commerce, financial inclusion and agri-tech access.",focus:"Phased national expansion"},
  {name:"Kisan Mart",sector:"Marketplaces",status:"Active",problem:"Fragmented access to buyers and inputs.",solution:"An active farmer-centered commerce and retail channel.",benefit:"Improved market reach, direct sales, and transparent price discovery.",focus:"Operational & expanding"},
  {name:"Kisan Pay",sector:"Financial Services",status:"Flagship",problem:"Farmers face gaps in accessible digital finance.",solution:"Compliant, partner-led digital payment and financial tools.",benefit:"More inclusive transactions, digital wallets, and financial services.",focus:"Integrated with Kisan Net"},
  {name:"Kisan Food Processing Industries",sector:"Agri-processing",status:"Planned",problem:"Farm value is often lost after harvest.",solution:"Proposed processing and value-addition infrastructure.",benefit:"More resilient value chains and better market options.",focus:"To be confirmed"},
  {name:"Kisan Carbon Credit",sector:"Carbon and Climate",status:"Planned",problem:"Smallholders struggle to participate in climate markets.",solution:"Evaluate credible aggregation and measurement pathways.",benefit:"Potential climate incentives with robust safeguards.",focus:"To be confirmed"},
  {name:"Kisan Travel Mart",sector:"Tourism",status:"Under Evaluation",problem:"Rural enterprises have limited access to tourism demand.",solution:"Evaluate links between local production, culture and travel.",benefit:"Diversified rural income opportunities.",focus:"To be confirmed"},
  {name:"Kisan Gas",sector:"Rural Services",status:"Under Evaluation",problem:"Rural energy access remains costly and uneven.",solution:"Assess farmer-serving energy distribution models.",benefit:"Reliable services and local enterprise participation.",focus:"To be confirmed"},
  {name:"Renewable Energy",sector:"Renewable Energy",status:"Strategic Sector",problem:"Productive rural energy needs are underserved.",solution:"Invest in scalable clean energy infrastructure.",benefit:"Lower-carbon, reliable productive power.",focus:"National opportunity"},
  {name:"Agri-logistics",sector:"Logistics",status:"Strategic Sector",problem:"Transport and cold-chain gaps reduce farmer margins.",solution:"Back efficient aggregation, storage and movement.",benefit:"Reduced loss and stronger market access.",focus:"National opportunity"}
];
export const faqs = [
  ["Is Kisan Impact Fund a charity or crowdfunding platform?","No. It is presented as an investment and holding company. Participation is subject to formal legal, regulatory and company approvals."],
  ["Are investment returns guaranteed?","No. Targets and projections are strategic goals. Returns depend on law, approvals, risk and company performance."],
  ["Can I invest online here?","No. This static website does not accept payments or investment transactions. Use the enquiry route to request verified information."],
  ["How can farmers participate?","Proposed eligibility includes qualified cooperative members, women’s groups, farmer groups and farmers identified through the Digital Farmers Mission."],
  ["Is every portfolio initiative operational?","No. Each venture is labeled Flagship, Planned, Under Evaluation or Strategic Sector to distinguish its current status."]
];
