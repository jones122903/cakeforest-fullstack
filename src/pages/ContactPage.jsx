import React, { useEffect } from 'react';
import Topbar from '../components/topbar/topbar';
import Footer from '../components/footer/footer';
import styles from './ContactPage.module.css';
import { Phone, Mail, MapPin, MessageCircle, Clock, Calendar } from 'lucide-react';

const ContactPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={styles.contactPage}>
            <Topbar />

            <main className={styles.contactContent}>
                <section className={styles.headerSection}>
                    <h1>Get in Touch</h1>
                    <p>We're here to make your celebrations even sweeter. Reach out to us for any queries, custom orders, or just to say hi!</p>
                </section>

                <div className={styles.contactGrid}>
                    {/* Email Card */}
                    <div className={styles.contactCard}>
                        <div className={styles.iconWrapper}>
                            <Mail size={32} />
                        </div>
                        <h3>Email Us</h3>
                        <p>Send us your thoughts anytime.</p>
                        <div className={styles.detailValue}>support@cakeforest.com</div>
                    </div>

                    {/* Call Card */}
                    <div className={styles.contactCard}>
                        <div className={styles.iconWrapper}>
                            <Phone size={32} />
                        </div>
                        <h3>Call Us</h3>
                        <p>Direct assistance for quick queries.</p>
                        <div className={styles.detailValue}>+91 98765 43210</div>
                    </div>

                    {/* Address Card */}
                    <div className={styles.contactCard}>
                        <div className={styles.iconWrapper}>
                            <MapPin size={32} />
                        </div>
                        <h3>Visit Us</h3>
                        <p>Find us at our flagship bakery.</p>
                        <div className={styles.detailValue}>123 Bakery Lane, Cake City, India</div>
                    </div>
                </div>

                <section className={styles.timingSection}>
                    <h2>Support Hours</h2>
                    <div className={styles.timingGrid}>
                        <div className={styles.timingItem}>
                            <div className={styles.timingIcon}>
                                <Clock size={28} />
                            </div>
                            <div className={styles.timingInfo}>
                                <h4>Call & Email Support</h4>
                                <p>8:45 AM - 11:15 PM</p>
                            </div>
                        </div>

                        <div className={styles.timingItem}>
                            <div className={styles.timingIcon}>
                                <MessageCircle size={28} />
                            </div>
                            <div className={styles.timingInfo}>
                                <h4>WhatsApp Support</h4>
                                <p>9:00 AM - 11:00 PM</p>
                            </div>
                        </div>

                        <div className={styles.timingItem}>
                            <div className={styles.timingIcon}>
                                <Calendar size={28} />
                            </div>
                            <div className={styles.timingInfo}>
                                <h4>Availability</h4>
                                <p>Available All 7 Days</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default ContactPage;
