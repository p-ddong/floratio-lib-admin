"use client";
import React, { useEffect, useState} from "react";
import { BASE_API, ENDPOINT_CONTRIBUTE } from "@/constant/API";
import axios from "axios";
import { Contribution } from "@/types";
// import { CldImage } from "next-cloudinary"; 


const ContributePage = () => {
  const [contributes, setContributes] = useState<Contribution[]>([]);
  

  useEffect(() => {
    const fetchContribute = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const res = await axios(`${BASE_API}${ENDPOINT_CONTRIBUTE.list}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.data;
        console.log(data)
        const contributePending = data.map((item:Contribution) => item.status === 'pending')
        setContributes(contributePending);
      } catch (error) {
        console.error("❌ Failed to fetch contributes:", error);
      }
    };

    fetchContribute();
  }, []);

  console.log('hieu')
  return (
    <div style={{ marginLeft: '240px', padding: '1rem' }}>


      <table className="userlist-table border border-black">
        <thead>
          <tr>
            <th
              className="userlist-header-cell"
              style={{ textAlign: "center" }}
            >
              Contributor
            </th>
            <th
              className="userlist-header-cell"
              style={{ textAlign: "center" }}
            >
              Science Name
            </th>
            <th
              className="userlist-header-cell"
              style={{ textAlign: "center" }}
            >
              Status
            </th>
            <th
              className="userlist-header-cell"
              style={{ textAlign: "center" }}
            >
              Type
            </th>
            <th
              className="userlist-header-cell"
              style={{ textAlign: "center" }}
            >
              Date of contribution
            </th>
          </tr>
        </thead>
        {/* <tbody className="cursor-pointer">
          {contributes.map((c) => (
            {}
            // <tr className="userlist-row" key={c._id}>
            //   <td className="userlist-cell" style={{ textAlign: "center" }}>
            //     {c.status}
            //   </td>
            //   <td className="userlist-cell" style={{ textAlign: "center" }}>
            //     {c.contribute_plant.scientific_name}
            //   </td>
            //   <td className="userlist-cell capitalize" style={{ textAlign: "center" }}>
            //     {c.status}
            //   </td>
            //   <td className="userlist-cell userlist-action-cell">
            //     {c.type}
            //   </td>
            //   <td className="userlist-cell userlist-action-cell">
            //     {c.createdAt}
            //   </td>
            // </tr>
          ))}
        </tbody> */}
      </table>
    </div>
  )
}

export default ContributePage