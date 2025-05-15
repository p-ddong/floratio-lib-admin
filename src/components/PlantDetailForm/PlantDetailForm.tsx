import {
  Field,
  Fieldset,
  Input,
  Textarea,
  Button,
  Box,
  HStack,
  Tag,
  TagEndElement,
} from "@chakra-ui/react";
import { useState } from "react";
import { PlantDetail } from "@/types/plant.types";

import { CldImage } from "next-cloudinary";

import "./PlantDetailForm.scss";

type Props = {
  initialData?: Partial<PlantDetail>;
  onSubmit: (data: any) => void;
};

type DescriptionSection = {
  title: string;
  tables: { title: string; content: string }[];
};

export default function PlantDetailFieldset({ initialData, onSubmit }: Props) {
  const [scientificName, setScientificName] = useState(
    initialData?.scientific_name || ""
  );
  const [familyName, setFamilyName] = useState(initialData?.family_name || "");
  const [attributes, setAttributes] = useState<string[]>(
    initialData?.attributes || []
  );
  const [commonNames, setCommonNames] = useState<string[]>(
    initialData?.common_name || []
  );
  const [images, setImages] = useState<string[]>(initialData?.images || []);

  const [speciesDescription, setSpeciesDescription] = useState<
    DescriptionSection[]
  >(initialData?.species_description || []);

  const [newCommon, setNewCommon] = useState("");
  const [newAttr, setNewAttr] = useState("");

  const handleSubmit = () => {
    onSubmit({
      scientific_name: scientificName,
      family_name: familyName,
      common_name: commonNames,
      attributes,
      images: images,
      species_description: speciesDescription,
    });
  };

  const handleImageClick = (index: number) => {
    const updated: string[] = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const removeItem = (index: number, from: "common" | "attr") => {
    const list = from === "common" ? [...commonNames] : [...attributes];
    list.splice(index, 1);
    if (from === "common") {
      setCommonNames(list);
    } else {
      setAttributes(list);
    }
  };

  const handleSectionChange = (idx: number, value: string) => {
    const copy = [...speciesDescription];
    copy[idx].title = value;
    setSpeciesDescription(copy);
  };

  const handleTableChange = (
    sectionIdx: number,
    tableIdx: number,
    field: "title" | "content",
    value: string
  ) => {
    const copy = [...speciesDescription];
    copy[sectionIdx].tables[tableIdx][field] = value;
    setSpeciesDescription(copy);
  };

  const addSection = () => {
    setSpeciesDescription([
      ...speciesDescription,
      { title: "", tables: [{ title: "", content: "" }] },
    ]);
  };

  const removeSection = (idx: number) => {
    const copy = [...speciesDescription];
    copy.splice(idx, 1);
    setSpeciesDescription(copy);
  };

  const addTable = (sectionIdx: number) => {
    const copy = [...speciesDescription];
    copy[sectionIdx].tables.push({ title: "", content: "" });
    setSpeciesDescription(copy);
  };

  const removeTable = (sectionIdx: number, tableIdx: number) => {
    const copy = [...speciesDescription];
    copy[sectionIdx].tables.splice(tableIdx, 1);
    setSpeciesDescription(copy);
  };

  return (
    <Box maxW="100%" px={6} className="plant-detail-form">
      <Fieldset.Root size="lg">
        <Fieldset.Legend>
          {initialData ? "Edit Plant" : "Create New Plant"}
        </Fieldset.Legend>
        <div className="main-content">
          <div className="left-content">
            <Field.Root>
              <Field.Label>Scientific Name</Field.Label>
              <Input
                value={scientificName}
                onChange={(e) => setScientificName(e.target.value)}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Family Name</Field.Label>
              <Input
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Common Names</Field.Label>
              <HStack>
                <Input
                  placeholder="Add common name"
                  value={newCommon}
                  onChange={(e) => setNewCommon(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (newCommon.trim()) {
                        setCommonNames([...commonNames, newCommon.trim()]);
                        setNewCommon("");
                      }
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    if (newCommon.trim()) {
                      setCommonNames([...commonNames, newCommon.trim()]);
                      setNewCommon("");
                    }
                  }}
                >
                  Add
                </Button>
              </HStack>
              <HStack wrap="wrap" mt={2}>
                {commonNames.map((item, idx) => (
                  <Tag.Root key={idx}>
                    <Tag.Label>{item}</Tag.Label>
                    <TagEndElement>
                      <Tag.CloseTrigger
                        onClick={() => removeItem(idx, "common")}
                      />
                    </TagEndElement>
                  </Tag.Root>
                ))}
              </HStack>
            </Field.Root>

            <Field.Root>
              <Field.Label>Attributes</Field.Label>
              <HStack>
                <Input
                  placeholder="Add attribute"
                  value={newAttr}
                  onChange={(e) => setNewAttr(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (newAttr.trim()) {
                        setAttributes([...attributes, newAttr.trim()]);
                        setNewAttr("");
                      }
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    if (newAttr.trim()) {
                      setAttributes([...attributes, newAttr.trim()]);
                      setNewAttr("");
                    }
                  }}
                >
                  Add
                </Button>
              </HStack>
              <HStack wrap="wrap" mt={2}>
                {attributes.map((item, idx) => (
                  <Tag.Root key={idx}>
                    <Tag.Label>{item}</Tag.Label>
                    <TagEndElement>
                      <Tag.CloseTrigger
                        onClick={() => removeItem(idx, "attr")}
                      />
                    </TagEndElement>
                  </Tag.Root>
                ))}
              </HStack>
            </Field.Root>

            <Field.Root>
              <Field.Label>Images</Field.Label> <Button>Add</Button>
              <div className="flex gap-4 flex-wrap mt-4">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleImageClick(idx)}
                    className="cursor-pointer relative"
                  >
                    <CldImage
                      alt={`Image ${idx + 1}`}
                      src={img}
                      width="200"
                      height="140"
                      crop={{ type: "auto", source: true }}
                      className="rounded shadow"
                    />
                  </div>
                ))}
              </div>
            </Field.Root>
          </div>

          {/* Right: Descriptions */}
          <div className="right-content">
            {speciesDescription.map((section, sectionIdx) => (
              <Box
                key={sectionIdx}
                border="1px solid #ccc"
                borderRadius="md"
                p={4}
                mb={2}
              >
                <Field.Root>
                  <Field.Label>Section Title</Field.Label>
                  <Input
                    value={section.title}
                    onChange={(e) =>
                      handleSectionChange(sectionIdx, e.target.value)
                    }
                  />
                </Field.Root>

                {section.tables.map((table, tableIdx) => (
                  <Box key={tableIdx} pl={4} borderLeft="2px solid #ddd" mt={4}>
                    <Field.Root>
                      <Field.Label>Table Title</Field.Label>
                      <Input
                        value={table.title}
                        onChange={(e) =>
                          handleTableChange(
                            sectionIdx,
                            tableIdx,
                            "title",
                            e.target.value
                          )
                        }
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Content</Field.Label>
                      <Textarea
                        value={table.content}
                        onChange={(e) =>
                          handleTableChange(
                            sectionIdx,
                            tableIdx,
                            "content",
                            e.target.value
                          )
                        }
                      />
                    </Field.Root>
                    <Button
                      mt={2}
                      colorScheme="red"
                      size="sm"
                      onClick={() => removeTable(sectionIdx, tableIdx)}
                    >
                      Remove Table
                    </Button>
                  </Box>
                ))}
                <HStack>
                  {" "}
                  <Button
                    mt={2}
                    ml={2}
                    size="sm"
                    onClick={() => addTable(sectionIdx)}
                  >
                    Add Table
                  </Button>
                  <Button
                    mt={2}
                    ml={2}
                    size="sm"
                    colorScheme="red"
                    onClick={() => removeSection(sectionIdx)}
                  >
                    Remove Section
                  </Button>
                </HStack>
              </Box>
            ))}

            <Button mt={2} onClick={addSection}>
              Add Description Section
            </Button>
          </div>
        </div>

        <Button mt={8} colorScheme="green" onClick={handleSubmit}>
          {initialData ? "Update Plant" : "Create Plant"}
        </Button>
      </Fieldset.Root>
    </Box>
  );
}
