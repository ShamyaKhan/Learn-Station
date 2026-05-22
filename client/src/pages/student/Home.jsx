import Companies from "../../components/student/Companies";
import CourseSection from "../../components/student/CourseSection";
import Hero from "../../components/student/Hero";
import Testimonials from "../../components/student/Testimonials";

const Home = () => {
  return (
    <div className="flex flex-col items-center space-y-7 text-center">
      <Hero />
      <Companies />
      <CourseSection />
      <Testimonials />
    </div>
  );
};

export default Home;
