"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PlantDetail } from "@/types/plant.types";
import { BASE_API, ENDPOINT_PLANT } from "@/constant/API";
import { CldImage } from "next-cloudinary";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "./PlantDetail.scss";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { Button, Dialog, Portal, CloseButton } from "@chakra-ui/react";
import PlantDetailFieldset from "@/components/PlantDetailForm/PlantDetailForm";

export default function PlantDetailPage() {
  const { id } = useParams();
  const [plant, setPlant] = useState<PlantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false)
  useEffect(() => {
    if (!id) return;

    const fetchPlant = async () => {
      try {
        const res = await fetch(`${BASE_API}${ENDPOINT_PLANT.detail}/${id}`);
        const data = await res.json();
        setPlant(data);
      } catch (error) {
        console.error("❌ Failed to fetch plant detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlant();
  }, [id]);

  if (loading)
    return <p className="text-center mt-10">Đang tải dữ liệu cây...</p>;
  if (!plant)
    return (
      <p className="text-center mt-10 text-red-500">Không tìm thấy cây.</p>
    );

  return (
    <div
      style={{ marginLeft: "240px", padding: "1rem" }}
      className="ml-[240px] p-6 plant-detail"
    >
      <div className="common-detail">
        <div className="detail">
          <div className="detail-content">
            <h1 className="">{plant.scientific_name}</h1>
            <p className="text-gray-600 mt-1">
              <strong>Family:</strong> {plant.family_name}
            </p>
            <p className="text-gray-600">
              <strong>Common Name:</strong> {plant.common_name.join(", ")}
            </p>
            <p className="text-gray-600">
              <strong>Attributes:</strong> {plant.attributes.join(", ")}
            </p>
          </div>

          <div className="detail-function">
            <Button bg={"green"} onClick={()=>setIsOpen(true)}>Update</Button>
            <Button bg={"red.600"}>Detele</Button>
          </div>
        </div>

        <div className="max-w-md mb-8">
          <Swiper pagination={true} modules={[Pagination]} className="mySwiper">
            {plant.images.map((img, idx) => (
              <SwiperSlide key={idx}>
                <CldImage
                  alt={`Image ${idx + 1}`}
                  src={img}
                  width="500"
                  height="350"
                  crop={{ type: "auto", source: true }}
                  className=""
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <div className="decription">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Descriptions
        </h2>
        <div className="space-y-6">
          {plant.species_description.map((section, index) => (
            <div key={index} className="section">
              <h3 className="section-title">{section.title}</h3>
              <ul className="section-content">
                {section.tables.map((table, i) => (
                  <li key={i} className="section-content-item">
                    <div className="section-content-title">{table.title}</div>{" "}
                    <div className="section-content-minicontent">
                      {table.content}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <Dialog.Root
        size="full"
        placement="center"
        motionPreset="slide-in-bottom"
        scrollBehavior="inside"

        open={isOpen}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.CloseTrigger asChild onClick={()=>setIsOpen(false)}>
                  <CloseButton size="sm" />
                </Dialog.CloseTrigger>
              </Dialog.Header>
              <Dialog.Body>
                <PlantDetailFieldset
                  initialData={plant} // hoặc undefined để tạo mới
                  onSubmit={() => {}}
                />
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </div>
  );
}
