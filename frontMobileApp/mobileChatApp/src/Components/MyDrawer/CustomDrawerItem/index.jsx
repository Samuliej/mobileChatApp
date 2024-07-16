import { DrawerItem  } from '@react-navigation/drawer'
import { View, Text, StyleSheet } from 'react-native'

/**
 * CustomDrawerItem is a component that renders a custom drawer item for use in a navigation drawer.
 * It extends the DrawerItem component from @react-navigation/drawer by adding a badge feature.
 *
 * Props:
 * - label: String. The text label for the drawer item.
 * - badgeCount: Number. The number to display in the badge. If greater than 0, the badge is displayed.
 * - ...props: Any additional props are passed down to the DrawerItem component.
 *
 * Returns:
 * - A DrawerItem component with a custom label that includes a badge if badgeCount is greater than 0.
 *
 */
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