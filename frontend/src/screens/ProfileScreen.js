import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, borderRadius, fontSize, shadow } from '../utils/theme';

const ProfileScreen = ({ navigation }) => {
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', onPress: logout, style: 'destructive' },
      ]
    );
  };

  // Handle case when currentUser is null
  if (!currentUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Loading user data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={60} color={colors.white} />
        </View>
        <Text style={styles.name}>{currentUser.fullName}</Text>
        <Text style={styles.username}>@{currentUser.username}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>

        <View style={styles.infoItem}>
          <Ionicons name="person-outline" size={20} color={colors.text} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Full Name</Text>
            <Text style={styles.infoValue}>{currentUser.fullName}</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="at-outline" size={20} color={colors.text} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Username</Text>
            <Text style={styles.infoValue}>@{currentUser.username}</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="mail-outline" size={20} color={colors.text} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{currentUser.email}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Ionicons name="create-outline" size={24} color={colors.primary} />
          <Text style={styles.actionButtonText}>Edit Profile</Text>
          <Ionicons name="chevron-forward" size={24} color={colors.darkGray} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color={colors.error} />
          <Text style={[styles.actionButtonText, styles.logoutText]}>Sign Out</Text>
          <Ionicons name="chevron-forward" size={24} color={colors.darkGray} />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Hive v1.0.0</Text>
        <Text style={styles.footerTagline}>Connect Your Crew, Your Way.</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadow.medium,
  },
  name: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
  },
  username: {
    fontSize: fontSize.md,
    color: colors.darkGray,
    marginTop: spacing.xs,
  },
  section: {
    marginTop: spacing.lg,
    backgroundColor: colors.white,
    paddingVertical: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: 'bold',
    color: colors.darkGray,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    textTransform: 'uppercase',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  infoContent: {
    marginLeft: spacing.md,
    flex: 1,
  },
  infoLabel: {
    fontSize: fontSize.xs,
    color: colors.darkGray,
  },
  infoValue: {
    fontSize: fontSize.md,
    color: colors.text,
    marginTop: spacing.xs,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  actionButtonText: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text,
    marginLeft: spacing.md,
    fontWeight: '600',
  },
  logoutButton: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: colors.error,
  },
  footer: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  footerText: {
    fontSize: fontSize.sm,
    color: colors.darkGray,
  },
  footerTagline: {
    fontSize: fontSize.xs,
    color: colors.darkGray,
    marginTop: spacing.xs,
  },
  errorText: {
    fontSize: fontSize.md,
    color: colors.darkGray,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});

export default ProfileScreen;
