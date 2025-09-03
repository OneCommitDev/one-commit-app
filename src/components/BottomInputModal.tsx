import React, { useEffect, useState } from "react";
import {  Modal,  View,  Text,  TouchableOpacity,  TextInput,  KeyboardAvoidingView,  Platform,  ScrollView,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ArrowButton from "./ArrowButton";
import AppInput from "./AppInput";
import TitleText from "./TitleText";
import AppText from "./AppText";
import { validateGPA, validateScore } from "~/utils/AppFunctions";

type BottomInputModalProps = {
  visible: boolean;
  title: string;
  label: string;
  typeis : string;
  value : string;
  onClose: () => void;
  onSave: (value: string) => void;
};

export default function BottomInputModal({
  visible,
  title,
  label,
  typeis,
  value,
  onClose,
  onSave,
}: BottomInputModalProps) {
const [inputValue, setInputValue] = useState(value);
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
const hasError = Boolean(errors.unweighted_gpa || errors.act_score || errors.sat_score);
const isDisabled = !inputValue || hasError;


  useEffect(() => {
    setInputValue(value || "");
  }, [value, visible]);

    const handleSubmit = () => {
     onSave(inputValue);
                  onClose();
                  setInputValue(""); // reset
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-1 justify-end bg-black/40">
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="bg-white rounded-t-2xl p-5 shadow-lg px-5 py-5 min-h-[300px]">
              {/* Header */}
              <View className="flex-row items-center justify-center">
               <AppText className="text-base font-semibold text-black">
                  {title}
                </AppText>
                <TouchableOpacity
                  onPress={onClose}
                  className="absolute right-0 p-2"
                >
                  <Ionicons name="close" size={22} color="black" />
                </TouchableOpacity>
              </View>

              {/* Label + Input */}
              <View className="mt-5">
               <AppText className="text-base font-semibold text-black">
                    {label}
                    </AppText>
               
                    <AppInput
                      value={inputValue}
                      keyboardType="decimal-pad"
                      placeholder="Enter here..."
                      onChangeValue={(text) => {
                        setInputValue(text); 
                        if(typeis === 'gpa'){
                           validateGPA(text, setErrors); 
                        }
                        else if(typeis === 'sat'){ 
                            validateScore(text, 'SAT', setErrors);
                         }
                        else if(typeis === 'act'){ 
                            validateScore(text, 'ACT', setErrors);
                         }
                       
                      }}
                      onBlur={() => {
                         if(typeis === 'gpa'){
                        let gpa = inputValue;
                        if (gpa) {
                          if (gpa.endsWith(".")) {
                            gpa = gpa + "0";
                          } else if (/^\d+$/.test(gpa)) {
                            gpa = gpa + ".0";
                          }
                        }
                        const num = parseFloat(gpa);
                        if (!isNaN(num)) {
                          if (num < 0) gpa = "0.0";
                          if (num > 4.5) gpa = "4.5";
                        }
                        const fixed = validateGPA(gpa, setErrors);
                        if (fixed !== undefined) {
                          setInputValue(fixed);
                        }
                      }
                      }}
                    />
                    {/* Error text */}
                    {errors.unweighted_gpa || errors.act_score || errors.sat_score ? (
                      <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
                        {errors.unweighted_gpa} {errors.act_score} {errors.sat_score}
                      </Text>
                    ) : null}
              </View>
              

              
                           <View className="mt-4">
                             <ArrowButton text="Proceed" onPress={handleSubmit} fullWidth  disabled={isDisabled}  />
                           </View>

             </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
