import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, borderRadius, fontSize } from '../utils/theme';

const SignUpScreen = ({ navigation }) => {
  const { signup } = useAuth();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateMobileNumber = (mobile) => {
    // Basic mobile number validation (10-15 digits)
    const re = /^[0-9]{10,15}$/;
    return re.test(mobile.replace(/[\s\-\(\)]/g, ''));
  };

  const handleSignUp = async () => {
    // Validation
    if (!fullName || !username || !email || !mobileNumber || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!validateMobileNumber(mobileNumber)) {
      Alert.alert('Error', 'Please enter a valid mobile number (10-15 digits)');
      return;
    }

    // Password validation (Requirement 9)
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        'Weak Password', 
        'Password must be at least 8 characters long and contain at least one number and one special character (!@#$%^&*)'
      );
      return;
    }

    // Password confirmation check
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match. Please make sure both passwords are the same.');
      return;
    }

    setLoading(true);
    const result = await signup(fullName, username, email, mobileNumber, password);
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', result.message, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert('Sign Up Failed', result.message);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={100}
      extraHeight={120}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join Hive and connect with your crew</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color={colors.text} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor={colors.darkGray}
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="at-outline" size={20} color={colors.text} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor={colors.darkGray}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color={colors.text} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.darkGray}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color={colors.text} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            placeholderTextColor={colors.darkGray}
            value={mobileNumber}
            onChangeText={setMobileNumber}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color={colors.text} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.darkGray}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons 
              name={showPassword ? "eye-outline" : "eye-off-outline"} 
              size={20} 
              color={colors.darkGray} 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color={colors.text} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor={colors.darkGray}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Ionicons 
              name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
              size={20} 
              color={colors.darkGray} 
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginTextBold}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    flexGrow: 1,
    padding: spacing.lg,
    paddingBottom: 40,
  },
  header: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.text,
    marginTop: spacing.sm,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: fontSize.md,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  loginText: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  loginTextBold: {
    fontWeight: 'bold',
    color: colors.primary,
  },
});

export default SignUpScreen;