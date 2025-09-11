import React from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ListRenderItem,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "./AppText";

const { height } = Dimensions.get("window");

type Props<T> = {
  visible: boolean;
  title?: string;
  data: T[];
  onClose: () => void;
  onSelect?: (item: T) => void; // ✅ new callback
  renderItem?: ListRenderItem<T>;
};

function ListviewShhet<T>({
  visible,
  title = "Details",
  data,
  onClose,
  onSelect,
  renderItem,
}: Props<T>) {
  // ✅ default fallback renderer for strings
  const defaultRenderItem: ListRenderItem<T> = ({ item }) => (
    <TouchableOpacity
      className="py-3"
      onPress={() => {
        onSelect?.(item); // send back selected item
        onClose();        // close modal
      }}
    >
      <AppText>{String(item)}</AppText>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end bg-black/40">
        <View
          className="bg-white rounded-t-2xl pt-4 px-5 pb-8 max-h-[70%]"
          style={{ minHeight: height * 0.4 }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4 mt-4">
            <Text className="text-center flex-1 text-primary text-16 font-nunitoextrabold">
              {title}
            </Text>
            <TouchableOpacity onPress={onClose} className="absolute right-0">
              <Ionicons name="close" size={24} color="#1A322E" />
            </TouchableOpacity>
          </View>

          {/* List */}
          <FlatList
            data={data}
            keyExtractor={(_, index) => index.toString()}
            ItemSeparatorComponent={() => (
              <View className="h-[1px] bg-gray-100" />
            )}
            renderItem={renderItem ?? defaultRenderItem}
          />
        </View>
      </View>
    </Modal>
  );
}

export default ListviewShhet;
