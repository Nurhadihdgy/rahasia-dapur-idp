import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronRight, LogOut, Settings, User as UserIcon } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthContext } from '../../context/AuthContext';
import { useAuth } from '../../hooks/useAuth';

export default function Profile() {
    const { user, isAuthenticated } = useAuthContext();
    const { handleLogout } = useAuth();
    const router = useRouter();

    if (!isAuthenticated) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <StatusBar style="dark" />
                <View style={styles.center}>
                    <View style={styles.emptyIconContainer}>
                        <UserIcon size={60} color="#CCC" />
                    </View>
                    <Text style={styles.emptyTitle}>Belum Masuk Akun</Text>
                    <Text style={styles.emptySubtitle}>Masuk untuk mengelola profil dan melihat resep favorit Anda.</Text>
                    <TouchableOpacity
                        style={styles.loginBtn}
                        onPress={() => router.push('/(auth)/login')}
                    >
                        <Text style={styles.loginBtnText}>Masuk Ke Akun</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar style="dark" />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View style={styles.avatar}>
                        <UserIcon size={45} color="#FF7A00" strokeWidth={1.5} />
                    </View>
                    <Text style={styles.name}>{user?.name || 'Pengguna'}</Text>
                    <Text style={styles.email}>{user?.email}</Text>
                </View>

                <View style={styles.menuContainer}>
                    <Text style={styles.menuLabel}>Pengaturan Akun</Text>
                    
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push('/profile/edit-profile')}
                    >
                        <View style={styles.menuIconWrapper}>
                            <UserIcon size={20} color="#FF7A00" />
                        </View>
                        <Text style={styles.menuText}>Ubah Profil</Text>
                        <ChevronRight size={18} color="#CCC" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push('/profile/change-password')}
                    >
                        <View style={[styles.menuIconWrapper, { backgroundColor: '#E8F5E9' }]}>
                            <Settings size={20} color="#4CAF50" />
                        </View>
                        <Text style={styles.menuText}>Keamanan Password</Text>
                        <ChevronRight size={18} color="#CCC" />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity
                        style={[styles.menuItem, styles.logoutItem]}
                        onPress={handleLogout}
                    >
                        <View style={[styles.menuIconWrapper, { backgroundColor: '#FFEBEE' }]}>
                            <LogOut size={20} color="#FF4B4B" />
                        </View>
                        <Text style={[styles.menuText, { color: '#FF4B4B' }]}>Keluar Aplikasi</Text>
                    </TouchableOpacity>
                </View>
                
                <Text style={styles.versionText}>Versi 1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
    emptyIconContainer: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    emptyTitle: { fontSize: 24, fontWeight: '800', color: '#1A1A1A', marginBottom: 10 },
    emptySubtitle: { fontSize: 15, color: '#666', textAlign: 'center', lineHeight: 22, marginBottom: 30 },
    header: {
        alignItems: 'center',
        paddingTop: 30,
        paddingBottom: 40,
        backgroundColor: '#FFF8F1',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#FF7A00',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 8,
    },
    name: { fontSize: 24, fontWeight: '900', color: '#1A1A1A', letterSpacing: -0.5 },
    email: { fontSize: 15, color: '#888', marginTop: 4 },
    menuContainer: { paddingHorizontal: 24, paddingTop: 30 },
    menuLabel: { fontSize: 13, fontWeight: '700', color: '#BBB', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 15, marginLeft: 5 },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginBottom: 8,
    },
    menuIconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#FFF3E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuText: { flex: 1, fontSize: 16, fontWeight: '600', color: '#333' },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 20, marginHorizontal: 10 },
    logoutItem: { marginTop: 5 },
    loginBtn: {
        backgroundColor: '#FF7A00',
        paddingHorizontal: 40,
        paddingVertical: 16,
        borderRadius: 20,
        shadowColor: '#FF7A00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    loginBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    versionText: { textAlign: 'center', color: '#CCC', fontSize: 12, marginTop: 40, marginBottom: 20 }
});