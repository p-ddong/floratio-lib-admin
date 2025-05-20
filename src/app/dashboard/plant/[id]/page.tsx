"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PlantDetail } from "@/types/plant.types";
import { BASE_API, ENDPOINT_PLANT } from "@/constant/API";
import { CldImage } from "next-cloudinary";

export default function PlantDetailPage() {
  const { id } = useParams();
  const [plant, setPlant] = useState<PlantDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchPlant = async () => {
      try {
        const res = await fetch(`${BASE_API}${ENDPOINT_PLANT.detail}/${id}`);
        const data = await res.json();
        setPlant(data);
        console.log(data)
      } catch (error) {
        console.error("Failed to fetch plant detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlant();
  }, [id]);

  if (loading) return <p>Đang tải dữ liệu cây...</p>;
  if (!plant) return <p>Không tìm thấy cây.</p>;

  return (
    <div style={{ marginLeft: '240px', padding: '1rem' }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
        {plant.scientific_name}
      </h1>
      <p>
        <strong>Family: </strong> {plant.family_name}
      </p>
      <p>
        <strong>Common Name:</strong> {plant.common_name.join(", ")}
      </p>
      <div style={{ marginTop: "1rem" }}>
      <CldImage
      className="img"
        alt=""
        src={plant.images[0]}
        width="200" 
        height="230"
        crop={{
          type: "auto",
          source: true,
        }}
      />
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h2>Decriptions</h2>
        {plant.species_description.map((section, index) => (
          <div key={index} style={{ marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "bold" }}>
              {section.title}
            </h3>
            <ul>
              {section.tables.map((table, i) => (
                <li key={i}>
                  <strong>{table.title}:</strong> {table.content}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
