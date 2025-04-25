import StepPage from "../components/StepPage";

export default function StepPageRoute() {
    const steps = [
        { id: 1, text: "Preheat the oven to 375°F (190°C)." },
        { id: 2, text: "Mix the dry ingredients together." },
        { id: 3, text: "Add the wet ingredients and stir." }
    ];

    return <StepPage steps={steps} />;
}
