import React, { useEffect } from 'react';
import Topbar from '../components/topbar/topbar';
import Footer from '../components/footer/footer';
import styles from './AboutPage.module.css';
import { Heart, Star, ShieldCheck, Users, Coffee, Utensils } from 'lucide-react';

const AboutPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={styles.aboutPage}>
            <Topbar />

            <main className={styles.aboutContent}>
                <section className={styles.heroSection}>
                    <div className={`${styles.heroOverlay} ${styles.animate}`}>
                        <h1>Our Sweet Story</h1>
                        <p>Baking love into every bite since 2015</p>
                    </div>
                </section>

                <section className={styles.storySection}>
                    <div className={styles.container}>
                        <div className={`${styles.textBlock} ${styles.animate} ${styles.delay1}`}>
                            <h2>Crafting Memories, One Cake at a Time</h2>
                            <p>
                                Welcome to Cake Forest, where passion meets perfection. What started as a small home bakery has grown into a beloved destination for dessert lovers. Our journey is flavored with dedication, creativity, and the joy of being part of your most special moments.
                            </p>
                            <p>
                                At Cake Forest, we believe that a cake is not just a dessert; it's a centerpiece of celebration, a symbol of love, and a creator of memories.
                            </p>
                        </div>
                    </div>
                </section>

                <section className={styles.valuesSection}>
                    <div className={styles.container}>
                        <h2 className={`${styles.sectionTitle} ${styles.animate}`}>What Defines Us</h2>
                        <div className={styles.valuesGrid}>
                            <div className={`${styles.valueCard} ${styles.animate} ${styles.delay1}`}>
                                <div className={styles.iconWrapper}>
                                    <Heart size={32} />
                                </div>
                                <h3>Baked with Love</h3>
                                <p>Every cake is handcrafted with care and attention to detail, ensuring it tastes as good as it looks.</p>
                            </div>

                            <div className={`${styles.valueCard} ${styles.animate} ${styles.delay2}`}>
                                <div className={styles.iconWrapper}>
                                    <Star size={32} />
                                </div>
                                <h3>Premium Quality</h3>
                                <p>We use only the finest, freshest ingredients to create flavors that are truly unforgettable.</p>
                            </div>

                            <div className={`${styles.valueCard} ${styles.animate} ${styles.delay3}`}>
                                <div className={styles.iconWrapper}>
                                    <ShieldCheck size={32} />
                                </div>
                                <h3>Hygienic standard</h3>
                                <p>Your health is our priority. We maintain the highest standards of cleanliness in our kitchen.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className={styles.statsSection}>
                    <div className={styles.container}>
                        <div className={`${styles.statsGrid} ${styles.animate}`}>
                            <div className={styles.statItem}>
                                <Users size={40} />
                                <div className={styles.statNumber}>50,000+</div>
                                <div className={styles.statLabel}>Happy Customers</div>
                            </div>
                            <div className={styles.statItem}>
                                <Utensils size={40} />
                                <div className={styles.statNumber}>200+</div>
                                <div className={styles.statLabel}>Unique Recipes</div>
                            </div>
                            <div className={styles.statItem}>
                                <Coffee size={40} />
                                <div className={styles.statNumber}>10+</div>
                                <div className={styles.statLabel}>Years of Experience</div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className={styles.missionSection}>
                    <div className={styles.container}>
                        <div className={`${styles.missionCard} ${styles.animate} ${styles.delay1}`}>
                            <h2>Our Mission</h2>
                            <p>
                                "To spread happiness through the art of baking, providing premium quality cakes that turn every occasion into a lifelong memory."
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default AboutPage;
