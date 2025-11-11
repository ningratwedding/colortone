
import { siteConfig } from '@/lib/config';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">
            Kebijakan Privasi
          </h1>
          <p className="mt-2 text-muted-foreground">
            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </header>

        <div className="prose prose-lg max-w-4xl mx-auto text-foreground">
          <p>
            Selamat datang di Kebijakan Privasi {siteConfig.name}. Privasi Anda sangat penting bagi kami. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, mengungkapkan, dan melindungi informasi Anda saat Anda mengunjungi situs web kami dan menggunakan layanan kami.
          </p>

          <h2>1. Informasi yang Kami Kumpulkan</h2>
          <p>
            Kami dapat mengumpulkan informasi tentang Anda dengan berbagai cara. Informasi yang dapat kami kumpulkan meliputi:
          </p>
          <ul>
            <li>
              <strong>Data Pribadi:</strong> Informasi yang dapat diidentifikasi secara pribadi, seperti nama, alamat email, nomor telepon, dan informasi demografis lainnya yang Anda berikan secara sukarela saat mendaftar atau berpartisipasi dalam berbagai aktivitas di situs.
            </li>
            <li>
              <strong>Data Turunan:</strong> Informasi yang dikumpulkan secara otomatis oleh server kami saat Anda mengakses Situs, seperti alamat IP Anda, jenis browser, sistem operasi, waktu akses, dan halaman yang telah Anda lihat secara langsung sebelum dan sesudah mengakses Situs.
            </li>
            <li>
              <strong>Data Keuangan:</strong> Data terkait metode pembayaran Anda (misalnya nomor kartu kredit yang valid, merek kartu, tanggal kedaluwarsa) yang kami kumpulkan saat Anda membeli, memesan, mengembalikan, atau menukar produk atau layanan dari Situs. Kami hanya menyimpan sedikit, jika ada, data keuangan yang kami kumpulkan.
            </li>
          </ul>

          <h2>2. Penggunaan Informasi Anda</h2>
          <p>
            Memiliki informasi yang akurat tentang Anda memungkinkan kami untuk memberikan Anda pengalaman yang lancar, efisien, dan disesuaikan. Secara khusus, kami dapat menggunakan informasi yang dikumpulkan tentang Anda melalui Situs untuk:
          </p>
          <ul>
            <li>Membuat dan mengelola akun Anda.</li>
            <li>Memproses pembayaran dan pengembalian dana Anda.</li>
            <li>Mengirimi Anda email mengenai akun atau pesanan Anda.</li>
            <li>Memberi tahu Anda tentang pembaruan pada Situs.</li>
            <li>Memantau dan menganalisis penggunaan dan tren untuk meningkatkan pengalaman Anda dengan Situs.</li>
          </ul>

          <h2>3. Pengungkapan Informasi Anda</h2>
          <p>
            Kami tidak akan membagikan informasi yang telah kami kumpulkan tentang Anda dengan pihak ketiga mana pun kecuali dalam situasi berikut:
          </p>
          <ul>
            <li>
              <strong>Berdasarkan Hukum atau untuk Melindungi Hak:</strong> Jika kami yakin pelepasan informasi tentang Anda diperlukan untuk menanggapi proses hukum, untuk menyelidiki atau memperbaiki potensi pelanggaran kebijakan kami, atau untuk melindungi hak, properti, dan keselamatan orang lain.
            </li>
            <li>
              <strong>Penyedia Layanan Pihak Ketiga:</strong> Kami dapat membagikan informasi Anda dengan pihak ketiga yang melakukan layanan untuk kami atau atas nama kami, termasuk pemrosesan pembayaran, analisis data, pengiriman email, layanan hosting, dan layanan pelanggan.
            </li>
          </ul>

          <h2>4. Keamanan Informasi Anda</h2>
          <p>
            Kami menggunakan tindakan keamanan administratif, teknis, dan fisik untuk membantu melindungi informasi pribadi Anda. Meskipun kami telah mengambil langkah-langkah yang wajar untuk mengamankan informasi pribadi yang Anda berikan kepada kami, perlu diketahui bahwa terlepas dari upaya kami, tidak ada tindakan keamanan yang sempurna atau tidak dapat ditembus, dan tidak ada metode transmisi data yang dapat dijamin terhadap intersepsi atau jenis penyalahgunaan lainnya.
          </p>
          
          <h2>5. Kebijakan untuk Anak-Anak</h2>
          <p>
            Kami tidak dengan sengaja meminta informasi dari atau memasarkan kepada anak-anak di bawah usia 13 tahun. Jika Anda mengetahui adanya data yang kami kumpulkan dari anak-anak di bawah usia 13 tahun, silakan hubungi kami menggunakan informasi kontak yang disediakan di bawah ini.
          </p>

          <h2>6. Hubungi Kami</h2>
          <p>
            Jika Anda memiliki pertanyaan atau komentar tentang Kebijakan Privasi ini, silakan hubungi kami di: <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
