
import React, { useState } from "react";

const projectsSeed = [
  {
    id: 1,
    jobNumber: "2025-001",
    jobName: "Rio Bank Elsa Expansion",
    client: "Rio Bank",
    lead: "Sergio",
    phase: "CA",
    status: "On Track",
    billingHealth: "healthy",
    contractAmount: 340000,
    totalBilled: 220000,
    totalCollected: 205000,
    remainingToBill: 120000,
    monthsActive: 15,
    consultants: [
      { name: "MEP Consultant", billed: 28000, collected: 25000 },
      { name: "Structural Consultant", billed: 14000, collected: 13000 }
    ]
  },
  {
    id: 2,
    jobNumber: "2025-002",
    jobName: "Weslaco Fire Station",
    client: "City of Weslaco",
    lead: "Jose",
    phase: "CA",
    status: "Watch",
    billingHealth: "warning",
    contractAmount: 410000,
    totalBilled: 390000,
    totalCollected: 360000,
    remainingToBill: 20000,
    monthsActive: 14,
    consultants: [
      { name: "Civil Consultant", billed: 36000, collected: 30000 }
    ]
  },
  {
    id: 3,
    jobNumber: "2025-003",
    jobName: "STC Building K Renovation",
    client: "STC",
    lead: "Jose",
    phase: "CA",
    status: "Waiting on Owner",
    billingHealth: "underwater",
    contractAmount: 180000,
    totalBilled: 180000,
    totalCollected: 135000,
    remainingToBill: 0,
    monthsActive: 7,
    consultants: [
      { name: "MEP Consultant", billed: 22000, collected: 17000 }
    ]
  }
];

const billingColorClasses = {
  healthy: "green",
  warning: "orange",
  underwater: "red"
};

function currency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function MonthSquares({ count }) {
  const squares = [];
  for (let i = 0; i < count; i++) {
    squares.push(
      <div key={i} style={{width:10,height:10,background:"#16a34a",marginRight:3}}/>
    );
  }
  return <div style={{display:"flex",flexWrap:"wrap"}}>{squares}</div>;
}

export default function App() {

  const [selected, setSelected] = useState(projectsSeed[0].id);

  const selectedProject = projectsSeed.find(p=>p.id===selected);

  return (
    <div style={{padding:40,fontFamily:"Arial"}}>

      <h1>SGA Operating Dashboard</h1>

      <h2>Projects</h2>

      <div>
        {projectsSeed.map(p=>(
          <div key={p.id}
            onClick={()=>setSelected(p.id)}
            style={{border:"1px solid #ccc",padding:10,marginBottom:6,cursor:"pointer"}}
          >
            <strong style={{color:billingColorClasses[p.billingHealth]}}>
              {p.jobNumber}
            </strong>
            {" | "}
            {p.jobName}
            {" | "}
            {p.lead}
            {" | "}
            {p.phase}
            {" | "}
            {p.status}
          </div>
        ))}
      </div>

      <h2 style={{marginTop:40}}>Project Detail</h2>

      <div style={{border:"1px solid #ddd",padding:20}}>

        <h3>{selectedProject.jobNumber} | {selectedProject.jobName}</h3>
        <p>{selectedProject.client}</p>

        <MonthSquares count={selectedProject.monthsActive}/>

        <p>Contract: {currency(selectedProject.contractAmount)}</p>
        <p>Billed: {currency(selectedProject.totalBilled)}</p>
        <p>Collected: {currency(selectedProject.totalCollected)}</p>
        <p>Remaining: {currency(selectedProject.remainingToBill)}</p>

        <h4>Consultants</h4>
        {selectedProject.consultants.map(c=>(
          <div key={c.name}>
            {c.name} — billed {currency(c.billed)} / collected {currency(c.collected)}
          </div>
        ))}

      </div>

    </div>
  );
}
