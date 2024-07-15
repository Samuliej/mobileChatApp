import { DrawerItem  } from '@react-navigation/drawer'
import { View, Text, StyleSheet } from 'react-native'

// Custom drawer item with badge for indicating pending friend requests in the drawer
const CustomDrawerItem = ({ label, badgeCount, ...props }) => (
  <DrawerItem
    label={() => (
      <View style={styles.rowAlign}>
        <Text style={styles.label}>{label}</Text>
        {badgeCount > 0 && (
          <View style={styles.badge}>
            <Text style={{ color: 'white' }}>{badgeCount}</Text>
          </View>
        )}
      </View>
    )}
    {...props}
  />
)

const styles = StyleSheet.create({
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  label: {
    color: '#696969',
    fontWeight: '500'
  },
  badge: {
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5
  }
})

export default CustomDrawerItem