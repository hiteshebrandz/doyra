export type GymExerciseGuide = {
  summary: string;
  steps: string[];
  cues: string[];
  avoid: string;
  searchTerm: string;
};

const guides: Record<string, GymExerciseGuide> = {
  "incline press": {
    summary: "A chest press performed on a slightly raised bench. Use dumbbells or a machine.",
    steps: ["Set the bench to a gentle incline and plant both feet on the floor.", "Start with the weights beside your upper chest, wrists straight.", "Press up without locking your elbows, then lower slowly until your elbows are just below the bench.", "Pause briefly, keep your shoulders down, and repeat."],
    cues: ["Keep your shoulder blades gently pulled back.", "Use a weight you can control for every rep."],
    avoid: "Do not bounce the weights, flare your elbows wide, or force a painful range.",
    searchTerm: "incline dumbbell press beginner form",
  },
  "incline dumbbell press": {
    summary: "A chest press performed on a slightly raised bench using two dumbbells.",
    steps: ["Set the bench to a gentle incline and plant both feet on the floor.", "Start with the dumbbells beside your upper chest, wrists straight.", "Press up smoothly, then lower slowly until you feel a comfortable chest stretch.", "Keep your shoulders relaxed and repeat."],
    cues: ["Keep your shoulder blades gently pulled back.", "Start lighter than you think while learning the movement."],
    avoid: "Do not bounce the dumbbells, arch aggressively, or train through shoulder pain.",
    searchTerm: "incline dumbbell press beginner form",
  },
  "goblet squat": {
    summary: "A squat holding one dumbbell close to your chest to train your legs and core.",
    steps: ["Hold one dumbbell vertically at your chest with both hands.", "Sit your hips down and back while keeping your chest tall.", "Lower only as far as you can keep your heels grounded and knees comfortable.", "Drive through the whole foot to stand tall."],
    cues: ["Keep your knees tracking in the same direction as your toes.", "Move slowly and breathe out as you stand."],
    avoid: "Do not let your heels lift or your knees collapse inward.",
    searchTerm: "goblet squat beginner form",
  },
  "pull-up": {
    summary: "A back exercise where you pull your body toward a bar. Use an assisted machine or band while learning.",
    steps: ["Grip the bar slightly wider than your shoulders and brace your core.", "Start with your shoulders down, not shrugged toward your ears.", "Pull your elbows toward your ribs until your chin approaches the bar.", "Lower with control instead of dropping."],
    cues: ["Use assistance so every rep is smooth.", "Keep your ribs down and avoid swinging."],
    avoid: "Do not kip, swing, or force a painful shoulder position.",
    searchTerm: "assisted pull up beginner form",
  },
};

export function getGymExerciseGuide(name: string): GymExerciseGuide {
  const key = name.trim().toLowerCase();
  return guides[key] ?? {
    summary: `${name} is a ${name.toLowerCase().includes("cardio") ? "cardio" : "strength"} movement. Learn the setup before adding weight.`,
    steps: ["Ask a gym trainer to show you the setup and starting position.", "Use a light load and move slowly through a comfortable range.", "Keep your breathing steady and stop if you feel sharp pain."],
    cues: ["Control the lowering part of each repetition.", "Choose a weight that leaves you with good form."],
    avoid: "Do not copy fast or heavy reps before you understand the movement.",
    searchTerm: `${name} beginner form`,
  };
}
