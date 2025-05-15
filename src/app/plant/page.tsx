"use client";

import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import {  PlantList } from "@/types";
import { Input, Skeleton, Box, Text, Button, HStack, Dialog, Portal, CloseButton } from "@chakra-ui/react";
import { CldImage } from "next-cloudinary";
import { BASE_API, ENDPOINT_PLANT } from "@/constant/API";
import { StoreContext } from "@/context/StoreContext";
import Link from "next/link";

import "./Plant.scss";
import PlantDetailFieldset from "@/components/PlantDetailForm/PlantDetailForm";

const PAGE_SIZE = 100;

export default function PlantPage() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("StoreContext must be used inside StoreProvider");
  const { plants, setPlants } = store;

  const [filteredPlants, setFilteredPlants] = useState<PlantList[]>([]);
  const [search, setSearch] = useState("");
  const [familyFilter, setFamilyFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [showDropdown, setShowDropdown] = useState(false);
  const [searchFamily, setSearchFamily] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Lọc danh sách họ theo thanh search
  const uniqueFamilies = [...new Set(plants.map((p) => p.family_name))];
  const filteredFamilies = uniqueFamilies.filter((f) =>
    f.toLowerCase().includes(searchFamily.toLowerCase())
  );

  // Click ngoài dropdown thì đóng
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchPlants = async () => {
      if (plants.length > 0) {
        setFilteredPlants(plants);
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const res = await axios.get(`${BASE_API}${ENDPOINT_PLANT.list}`);
        setPlants(res.data);
      } catch (error) {
        console.error("Failed to fetch plants", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlants();
  }, [plants, setPlants]);

  useEffect(() => {
    const filtered = plants.filter((plant) => {
      const matchSearch =
        plant.scientific_name.toLowerCase().includes(search.toLowerCase()) ||
        plant.common_name
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchFamily = familyFilter
        ? plant.family_name === familyFilter
        : true;

      return matchSearch && matchFamily;
    });

    setFilteredPlants(filtered);
    setCurrentPage(1);
  }, [search, familyFilter, plants]);

  const paginatedPlants = filteredPlants.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const totalPages = Math.ceil(filteredPlants.length / PAGE_SIZE);

  return (
    <div style={{ marginLeft: "240px", padding: "1rem" }} className="plant">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Plant List
      </Text>

      {/* Search & Filter */}
      <HStack spaceX={4} spaceY={4} mb={4} className="search-filter">
        <Input
          className="search"
          placeholder="Search plant..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Custom Dropdown with Search */}
        <div className="filter relative w-64 m-0" ref={dropdownRef}>
          <Button
            onClick={() => setShowDropdown(!showDropdown)}
            className="px-4 py-2 border border-black rounded-md w-full bg-white text-left p-3"
          >
            {familyFilter || "Filter by family"}
          </Button>

          {showDropdown && (
            <div className="family-list absolute mt-2 w-full border border-black rounded-md bg-white z-50 p-3">
              <input
                type="text"
                placeholder="Search family..."
                value={searchFamily}
                onChange={(e) => setSearchFamily(e.target.value)}
                className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none"
              />
              <div className="max-h-60 overflow-y-auto p-2">
                {filteredFamilies.length > 0 ? (
                  filteredFamilies.map((family) => (
                    <div
                      key={family}
                      onClick={() => {
                        setFamilyFilter(family);
                        setShowDropdown(false);
                        setSearchFamily("");
                      }}
                      className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${
                        family === familyFilter ? "bg-blue-200 font-medium" : ""
                      }`}
                    >
                      {family}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-400">No results</div>
                )}
              </div>
            </div>
          )}
        </div>
        <Button bg={"green"} onClick={() => setIsOpen(true)}>
          Add
        </Button>
      </HStack>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "1rem",
        }}
      >
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => (
              <Box
                key={i}
                p={4}
                border="1px solid #ccc"
                borderRadius="md"
                bg="white"
              >
                <Skeleton height="200px" mb={4} />
                <Skeleton height="20px" mb={2} />
                <Skeleton height="16px" />
              </Box>
            ))
          : paginatedPlants.map((plant) => (
              <Link href={`/plant/${plant._id}`} key={plant._id}>
                <Box p={4} border="1px solid #ccc" borderRadius="md" bg="white">
                  {plant.image ? (
                    <CldImage
                      src={plant.image}
                      alt={plant.scientific_name}
                      width="200"
                      height="200"
                      crop={{ type: "auto", source: true }}
                    />
                  ) : (
                    <Box
                      width="200px"
                      height="200px"
                      bg="gray.100"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      borderRadius="md"
                    >
                      <Text fontSize="sm" color="gray.500">
                        No Image
                      </Text>
                    </Box>
                  )}
                  <Text fontWeight="bold" mt={2}>
                    {plant.scientific_name}
                  </Text>
                  <Text>{plant.family_name}</Text>
                  <Text fontSize="sm" color="gray.600">
                    {plant.common_name.join(", ")}
                  </Text>
                </Box>
              </Link>
            ))}
      </div>

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <HStack spaceX={4} spaceY={4} mt={6}>
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          >
            Previous
          </Button>
          <Text>
            Page {currentPage} of {totalPages}
          </Text>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
          >
            Next
          </Button>
        </HStack>
      )}

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
                <Dialog.CloseTrigger asChild onClick={() => setIsOpen(false)}>
                  <CloseButton size="sm" />
                </Dialog.CloseTrigger>
              </Dialog.Header>
              <Dialog.Body>
                <PlantDetailFieldset
                  initialData={undefined}
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
