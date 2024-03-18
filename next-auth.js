export default NextAuth({
  // Konfigurasi NextAuth lainnya...
  session: {
    // Gunakan localStorage sebagai penyimpanan token sesi
    storeAccessToken: true,
    storeRefreshToken: true,
    storeIdToken: true,
  },
});
