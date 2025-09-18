import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import WheelPickerExpo from "react-native-wheel-picker-expo";
import TitleText from "./TitleText";

const screenWidth = Dimensions.get("window").width;

type FeetMeterPickerModalProps = {
  title : string;
  visible: boolean;
  onClose: () => void;
  onDelete?: () => void;
  selectedUnit: "feet" | "meters";
  onUnitChange: (unit: "feet" | "meters") => void;
  onSave: (
  mainValue: number,
  decimalValue: number,
  unit: "feet" | "meters"
  ) => void;

  initialMainValue?: number;
  initialDecimalValue?: number;
  };

export const FeetMeterPickerModal: React.FC<FeetMeterPickerModalProps> = ({
  title,
  visible,
  onClose,
  onDelete,
  selectedUnit,
  onUnitChange,
  onSave,
  initialMainValue,
  initialDecimalValue,
}) => {
  const [mainIndex, setMainIndex] = useState(0);
  const [decimalIndex, setDecimalIndex] = useState(0);

  const generateRange = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => ({
      label: (start + i).toString(),
      value: start + i,
      key: (start + i).toString(),
    }));

  // Values for each unit
  const mainItems =
    selectedUnit === "feet"
      ? generateRange(1, 14) // feet
      : generateRange(0, 31); // meters

  const decimalItems =
    selectedUnit === "feet"
      ? generateRange(0, 11) // inches
      : generateRange(0, 12); // centimeters

  // reset indexes when modal opens
 useEffect(() => {
  if (visible) {
    // Find matching main value index
    const mainIdx = mainItems.findIndex(
      (item) => item.value === initialMainValue
    );
    const decimalIdx = decimalItems.findIndex(
      (item) => item.value === initialDecimalValue
    );

    setMainIndex(mainIdx >= 0 ? mainIdx : 0);
    setDecimalIndex(decimalIdx >= 0 ? decimalIdx : 0);
  }
}, [visible, selectedUnit, initialMainValue, initialDecimalValue]);



  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.4)" }}
      >
        <View
          style={{
            backgroundColor: "#ffffff",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingTop: 12,
            paddingBottom: 24,
          }}
        >
          {/* Header */}
          {/* <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
              paddingHorizontal: 16,
            }}
          >
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#111827" />
            </TouchableOpacity>

            <Text style={{ fontSize: 16, fontWeight: "600", color: "#000" }}>
               {title}
            </Text>

               {onDelete && (
                  <TouchableOpacity
                    style={{ marginRight: 8 }}
                    onPress={() => {
                      const mainValue = mainItems[mainIndex]?.value ?? 0;
                      const decimalValue = decimalItems[decimalIndex]?.value ?? 0;

                      onDelete(); 
                      onClose();
                    }}
                  >
                    <Ionicons name="trash" size={26} color="#235D48" />
                  </TouchableOpacity>
                )}


          <TouchableOpacity
        onPress={() => {
          const mainValue = mainItems[mainIndex]?.value ?? 0;
          const decimalValue = decimalItems[decimalIndex]?.value ?? 0;

          onSave(mainValue, decimalValue, selectedUnit);  
          onClose();
        }}
      >
                    <Ionicons name="checkmark" size={26} color="#235D48" />
                  </TouchableOpacity>
          </View> */}
          {/* Header */}
<View
  style={{
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 16,
  }}
>
  {/* Close button on the left */}
  <TouchableOpacity onPress={onClose}>
    <Ionicons name="close" size={24} color="#111827" />
  </TouchableOpacity>

  {/* Title in the center */}
  <TitleText>
    {title}
  </TitleText>

  {/* Right-side actions: trash (if exists) + checkmark */}
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    {onDelete && (
      <TouchableOpacity
        style={{ marginRight: 12 }}
        onPress={() => {
          onDelete();
          onClose();
        }}
      >
        <Ionicons name="trash" size={26} color="#235D48" />
      </TouchableOpacity>
    )}

    <TouchableOpacity
      onPress={() => {
        const mainValue = mainItems[mainIndex]?.value ?? 0;
        const decimalValue = decimalItems[decimalIndex]?.value ?? 0;

        onSave(mainValue, decimalValue, selectedUnit);
        onClose();
      }}
    >
      <Ionicons name="checkmark" size={26} color="#235D48" />
    </TouchableOpacity>
  </View>
</View>


          {/* Unit Toggle */}
          <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 16 }}>
            <View
              style={{
                flexDirection: "row",
                borderRadius: 999,
                borderWidth: 1,
                borderColor: "#ccc",
                backgroundColor: "#fff",
                overflow: "hidden",
              }}
            >
              <TouchableOpacity
                onPress={() => onUnitChange("feet")}
                activeOpacity={1}
                style={{
                  paddingHorizontal: 24,
                  paddingVertical: 10,
                  backgroundColor: selectedUnit === "feet" ? "#E5E7EB" : "#FFFFFF",
                }}
              >
                <Text style={{ color: "#000", fontWeight: "500" }}>Feet</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onUnitChange("meters")}
                activeOpacity={1}
                style={{
                  paddingHorizontal: 24,
                  paddingVertical: 10,
                  backgroundColor: selectedUnit === "meters" ? "#E5E7EB" : "#FFFFFF",
                }}
              >
                <Text style={{ color: "#000", fontWeight: "500" }}>Meters</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Pickers */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 16,
              backgroundColor: "#eaeded",
            }}
          >
            <WheelPickerExpo
              key={`main-${selectedUnit}-${visible}`}
              height={250}
              width={screenWidth / 3}
              items={mainItems}
              initialSelectedIndex={mainIndex}
              onChange={({ index }) => setMainIndex(index)}
              backgroundColor="#eaeded"
              selectedStyle={{ borderColor: "#647067", borderWidth: 0.3 }}
            />

            <Text style={{ fontSize: 28, fontWeight: "600", marginHorizontal: 8 }}>
              {selectedUnit === "feet" ? "'" : "."}
            </Text>

            <WheelPickerExpo
              key={`decimal-${selectedUnit}-${visible}`}
              height={250}
              width={screenWidth / 3}
              items={decimalItems}
              initialSelectedIndex={decimalIndex}
              onChange={({ index }) => setDecimalIndex(index)}
              backgroundColor="#eaeded"
              selectedStyle={{ borderColor: "#647067", borderWidth: 0.3 }}
            />

            <Text style={{ fontSize: 20, fontWeight: "500", marginLeft: 6 }}>
              {selectedUnit === "feet" ? '' : ""}
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
