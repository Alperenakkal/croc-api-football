import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


const DateComponent = ({ onDateChange }) => {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [daysList, setDaysList] = useState([]);
  const dropdownRef = useRef(null);

  const monthNames = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ];

  useEffect(() => {
    const newDaysList = [];
    for (let i = -3; i <= 3; i++) {
      const newDate = new Date(currentYear, currentMonth, selectedDay + i);
      newDaysList.push(newDate.getDate());
    }
    setDaysList(newDaysList); 
       
    onDateChange(selectedDay, selectedMonth, selectedYear);
  }, [selectedDay, selectedMonth, selectedYear, onDateChange]);;



  const handlePrevious = () => {
    setSelectedDay(selectedDay - 1);
  };

  const handleNext = () => {
    setSelectedDay(selectedDay + 1);
  };

  const windowWidth = Dimensions.get('window').width;
 
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.dateNav}>
          <TouchableOpacity onPress={handlePrevious} style={styles.navButton}>
            <AntDesign name="left" size={20} color="#333" />
          </TouchableOpacity>
          <View style={styles.daysContainer}>
            {daysList.map((day) => {
              const isToday = day === selectedDay;
              return (
                <Text
                  style={[
                    styles.dayText,
                    isToday && styles.todayText,
                    { fontSize: windowWidth > 350 ? 16 : 14 }
                  ]}
                  key={day}
                >
                  {day}
                </Text>
              );
            })}
          </View>
          <TouchableOpacity onPress={handleNext} style={styles.navButton}>
            <AntDesign name="right" size={20} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.monthYearContainer}>
        <ModalDropdown
          ref={dropdownRef}
          options={monthNames}
          defaultValue={monthNames[selectedMonth]}
          onSelect={(index) => setSelectedMonth(parseInt(index))}
          style={[styles.dropdown, { width: windowWidth > 400 ? 120 : 90 }]}
          textStyle={[styles.dropdownText, { fontSize: windowWidth > 400 ? 18 : 16 }]}
          dropdownStyle={[styles.dropdownStyle, { width: windowWidth > 400 ? 120 : 90 }]}
          dropdownTextStyle={[styles.dropdownTextStyle, { fontSize: windowWidth > 400 ? 16 : 14 }]}
          dropdownTextHighlightStyle={styles.dropdownTextHighlightStyle}
        />
        <Text style={[styles.yearText, { fontSize: windowWidth > 400 ? 18 : 16 }]}>{selectedYear}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  header: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 10,
  },
  dateNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButton: {
    padding: 8,
  },
  daysContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
    gap: 20,
  },
  dayText: {
    fontWeight: '600',
    color: '#333',
  },
  todayText: {
    color: '#fff',
    backgroundColor: '#FCB61A',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  monthYearContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
  },
  dropdownText: {
    fontWeight: '600',
    color: '#333',
  },
  dropdownStyle: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 5,
  },
  dropdownTextStyle: {
    color: '#333',
    padding: 8,
  },
  dropdownTextHighlightStyle: {
    backgroundColor: '#e91e63',
    color: '#fff',
  },
  yearText: {
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
});

export default DateComponent;
