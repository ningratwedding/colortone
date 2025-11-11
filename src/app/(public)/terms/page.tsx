
import { siteConfig } from '@/lib/config';

export default function TermsOfServicePage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">
            Ketentuan Layanan
          </h1>
          <p className="mt-2 text-muted-foreground">
            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </header>

        <div className="prose prose-lg max-w-4xl mx-auto text-foreground">
          <p>
            Selamat datang di {siteConfig.name}! Syarat dan Ketentuan ini mengatur penggunaan Anda atas situs web dan layanan kami. Dengan mengakses atau menggunakan layanan kami, Anda setuju untuk terikat oleh Syarat dan Ketentuan ini.
          </p>

          <h2>1. Penerimaan Persyaratan</h2>
          <p>
            Dengan membuat akun atau menggunakan Layanan kami, Anda mengonfirmasi bahwa Anda telah membaca, memahami, dan setuju untuk terikat oleh Ketentuan ini. Jika Anda tidak setuju dengan Ketentuan ini, Anda tidak boleh menggunakan Layanan kami.
          </p>

          <h2>2. Akun Pengguna</h2>
          <p>
            Anda bertanggung jawab untuk menjaga kerahasiaan informasi akun Anda, termasuk kata sandi Anda, dan untuk semua aktivitas yang terjadi di bawah akun Anda. Anda setuju untuk segera memberitahu kami tentang penggunaan akun Anda yang tidak sah.
          </p>

          <h2>3. Produk dan Pembayaran</h2>
          <p>
            Semua penjualan yang dilakukan melalui {siteConfig.name} bersifat final, kecuali dinyatakan lain. Kreator bertanggung jawab atas produk yang mereka jual, dan {siteConfig.name} bertindak sebagai platform untuk memfasilitasi transaksi. Pembayaran diproses melalui gateway pembayaran pihak ketiga yang aman.
          </p>
          
          <h2>4. Perilaku Pengguna</h2>
          <p>
            Anda setuju untuk tidak menggunakan Layanan untuk tujuan ilegal atau tidak sah. Anda tidak boleh, dalam penggunaan Layanan, melanggar hukum apa pun di yurisdiksi Anda. Anda bertanggung jawab penuh atas perilaku dan data, teks, informasi, nama layar, grafik, foto, profil, klip audio dan video, dan tautan yang Anda kirimkan, posting, dan tampilkan di Layanan {siteConfig.name}.
          </p>

          <h2>5. Hak Kekayaan Intelektual</h2>
          <p>
            Kreator mempertahankan semua hak atas konten dan produk yang mereka unggah ke {siteConfig.name}. Namun, dengan mengunggah konten, Anda memberikan {siteConfig.name} lisensi non-eksklusif, bebas royalti, di seluruh dunia untuk menggunakan, menampilkan, dan mendistribusikan konten Anda di platform kami.
          </p>

          <h2>6. Batasan Tanggung Jawab</h2>
          <p>
            Dalam keadaan apa pun {siteConfig.name} tidak akan bertanggung jawab atas kerusakan tidak langsung, insidental, khusus, konsekuensial, atau hukuman, termasuk namun tidak terbatas pada, kehilangan keuntungan, data, penggunaan, atau kerugian tidak berwujud lainnya, yang diakibatkan oleh akses Anda ke atau penggunaan atau ketidakmampuan untuk mengakses atau menggunakan Layanan.
          </p>

          <h2>7. Perubahan pada Ketentuan</h2>
          <p>
            Kami berhak, atas kebijakan kami sendiri, untuk mengubah atau mengganti Ketentuan ini kapan saja. Jika revisi bersifat material, kami akan memberikan pemberitahuan setidaknya 30 hari sebelum ketentuan baru berlaku.
          </p>

          <h2>8. Hubungi Kami</h2>
          <p>
            Jika Anda memiliki pertanyaan tentang Ketentuan ini, silakan hubungi kami di: <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
