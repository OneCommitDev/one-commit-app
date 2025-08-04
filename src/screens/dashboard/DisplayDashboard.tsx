import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import AppText from '~/components/AppText';
import ArrowButton from '~/components/ArrowButton';
import TitleText from '~/components/TitleText';
import WhiteCustomButton from '~/components/WhiteCustomButton';

const data = [
  {
    name: 'Stanford University',
    status: 'Waiting for reply',
    logo: 'https://img.freepik.com/premium-vector/university-college-school-crests-logo-emblem-vector-template_441059-1012.jpg?semt=ais_hybrid&w=740',
  },
  {
    name: 'Pomona College',
    status: 'Waiting for reply',
    logo: 'https://marketplace.canva.com/EAGSIcoid00/1/0/1600w/canva-blue-white-modern-school-logo-ZBxBTP6Lc-E.jpg',
  },
  {
    name: 'Massachusetts Institute of Technology',
    status: 'Waiting for reply',
    logo: 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/university-logo-design-template-cde09bc85a2ae74f2d564879c231de22_screen.jpg?ts=1738458416',
  },
  {
    name: 'Claremont McKenna College',
    status: 'Waiting for reply',
    logo: 'https://img.freepik.com/premium-vector/university-college-school-crests-logo-emblem-vector-template_441059-1012.jpg?semt=ais_hybrid&w=740',
  },
  {
    name: 'Tufts University',
    status: 'Started',
    logo: 'https://img.freepik.com/premium-vector/university-college-school-crests-logo-emblem-vector-template_441059-1012.jpg?semt=ais_hybrid&w=740',
  },
  {
    name: 'Bates College',
    status: 'Started',
    logo: 'https://img.freepik.com/premium-vector/university-college-school-crests-logo-emblem-vector-template_441059-1012.jpg?semt=ais_hybrid&w=740',
  },
  {
    name: 'Brown University',
    status: 'Started',
    logo: 'https://img.freepik.com/premium-vector/university-college-school-crests-logo-emblem-vector-template_441059-1012.jpg?semt=ais_hybrid&w=740',
  },
];

const StatusBadge = ({ status }: { status: string }) => {
  const isStarted = status === 'Started';
  const bgColor = isStarted ? '#FBC02D' : '#E8F5E9';
  const textColor = isStarted ? '#000' : '#1B5E20';

  return (
    <View
      className="w-[100px] items-center justify-center px-3 py-1 rounded-[8px] ml-2"
      style={{ backgroundColor: bgColor }}
    >
      <AppText className="text-center" style={{ color: textColor }}>
        {status}
      </AppText>
    </View>
  );
};

export default function DisplayDashboard() {
 const renderItem = ({ item, index }: { item: typeof data[0]; index: number }) => (
  <View className="bg-white rounded-[12px] p-4 mb-4 shadow shadow-black/10">
   
 <View className="flex-row justify-between items-start mb-3">
  <View className="flex-1 pr-2">
    <View className="flex-row items-start">
      <TitleText className=" mr-3 ">#{index + 1}</TitleText>
     <View className='flex-row justify-between'>
    <View className='flex-1'>
         <TitleText   numberOfLines={2}       className="flex-1 leading-tight" >
        {item.name}
      </TitleText>
      <Text>jhghghghjg</Text>
    </View>


 <View className='mr-8'>
        <Image
        source={{ uri: item.logo }}
        className="w-[48px] h-[48px] rounded-[8px]"
        resizeMode="contain"
      />
      </View>
     </View>
    </View>







       {/* Middle Stats */}
    <View className="flex-row justify-between mt-1">
      <View className="bg-gray-100  rounded-md w-[33%] ml-1 items-center h-16 text-center justify-center">
         <Text className='text-18 font-nunitoextrabold text-pretty'>79%</Text>
                <Text className="text-12 text-black -mt-1 font-nunitoregular">
                  Match Score
                  </Text>

      </View>
      <View className="bg-gray-100  rounded-md w-[33%] ml-1 items-center h-16 text-center justify-center">
         <Text className='text-18 font-nunitoextrabold text-pretty'>79%</Text>
                <Text className="text-12 text-black -mt-1 font-nunitoregular">
          Coach Interest
          </Text>
      </View>

      <View className="bg-gray-100  rounded-md w-[33%] ml-1 items-center h-16 text-center justify-center">
         <Text className='text-18 font-nunitoextrabold text-pretty'>79%</Text>
                <Text className="text-12 text-black -mt-1 font-nunitoregular">
          Progress
          </Text>
      </View>





        {/* Right: Logo + Star */}
  {/* <View className="items-center w-[18%] ml-2">
    <View className='border border-gray-200 rounded-[10px] p-1 mb-1'>
      <Image
        source={{ uri: item.logo }}
        className="w-[60px] h-[60px] rounded-[8px]"
        resizeMode="contain"
      />
    </View>
    </View> */}
  </View>


  </View>
</View>


 

    {/* Action Button */}
    {/* <View className='flex-row justify-between -mt-3'>
      <TouchableOpacity
      className='px-4 h-[40px] w-[48%] bg-primary rounded-[10px] text-center items-center justify-center'>
       <AppText className='text-white'>{item.status}</AppText>
      </TouchableOpacity> 
    
          <TouchableOpacity
      className='px-4 h-[40px] w-[48%] bg-primary rounded-[10px] text-center items-center justify-center'>
       <AppText color='text-white'>View More</AppText>
      </TouchableOpacity> 
    </View>        */}

    <WhiteCustomButton height={40}  fullWidth text={item.status} onPress={function (): void {
       
     } } />
    
  </View>
);



  return (
    <View className="flex-1 bg-[#f5f5f5] pt-14 px-4">
      <TitleText size="text-24">Dashboard</TitleText>
      <AppText className="mb-3">{data.length} Active Schools</AppText>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
