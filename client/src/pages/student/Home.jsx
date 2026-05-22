import CallToAction from "../../components/student/CallToAction";
import Companies from "../../components/student/Companies";
import CourseSection from "../../components/student/CourseSection";
import Footer from "../../components/student/Footer";
import Hero from "../../components/student/Hero";
import Testimonials from "../../components/student/Testimonials";

const Home = () => {
  return (
    <div className="flex flex-col items-center space-y-7 text-center">
      <Hero />
      <Companies />
      <CourseSection />
      <Testimonials />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Home;
