export interface TarotCard {
  id: number
  name: string
  upright: string[]
  reversed: string[]
  meaning: string
  element?: string
}

export const TAROT_DECK: TarotCard[] = [
  { id: 0, name: "The Fool", upright: ["beginnings", "leap", "innocence"], reversed: ["recklessness", "foolishness"],
    meaning: "an open road and an unpacked bag. you don't have a plan and that is the plan." },
  { id: 1, name: "The Magician", upright: ["will", "skill", "manifestation"], reversed: ["manipulation", "untapped"],
    meaning: "the tools are already on the table. arrange them and start." },
  { id: 2, name: "The High Priestess", upright: ["intuition", "patience", "the inner room"], reversed: ["secrets", "withdrawal"],
    meaning: "you know more than you've said out loud. sit with it for a bit." },
  { id: 3, name: "The Empress", upright: ["abundance", "softness", "growth"], reversed: ["smother", "stagnant"],
    meaning: "tend to things gently. they grow if left alone with sun and water." },
  { id: 4, name: "The Emperor", upright: ["structure", "authority", "boundary"], reversed: ["rigidity", "overreach"],
    meaning: "build a frame. inside the frame, you can do almost anything." },
  { id: 5, name: "The Hierophant", upright: ["tradition", "study", "doctrine"], reversed: ["dogma", "rebellion"],
    meaning: "old methods exist for a reason. learn them before you break them." },
  { id: 6, name: "The Lovers", upright: ["choice", "union", "alignment"], reversed: ["mismatch", "indecision"],
    meaning: "two paths are not equal even when they look it. pick on values, not optics." },
  { id: 7, name: "The Chariot", upright: ["drive", "control", "victory"], reversed: ["scattered", "stalled"],
    meaning: "two horses pulling opposite ways still moves the cart, just slower." },
  { id: 8, name: "Strength", upright: ["courage", "patience", "soft power"], reversed: ["self-doubt", "force"],
    meaning: "the lion responds to a low voice, not a raised one." },
  { id: 9, name: "The Hermit", upright: ["solitude", "lantern", "study"], reversed: ["isolation", "stuck"],
    meaning: "go down the mountain alone for a while. bring back what you find." },
  { id: 10, name: "Wheel of Fortune", upright: ["cycle", "luck", "turning"], reversed: ["resistance", "delay"],
    meaning: "the wheel turns whether you push it or not. read the moment." },
  { id: 11, name: "Justice", upright: ["balance", "truth", "law"], reversed: ["bias", "evasion"],
    meaning: "the scales don't care about your story. weigh honestly." },
  { id: 12, name: "The Hanged Man", upright: ["pause", "reframe", "surrender"], reversed: ["stalling", "martyrdom"],
    meaning: "a problem turned upside down often shows its seams." },
  { id: 13, name: "Death", upright: ["ending", "transition", "shed"], reversed: ["clinging", "fear"],
    meaning: "not the literal kind. something is over. let it be over." },
  { id: 14, name: "Temperance", upright: ["blend", "moderation", "patience"], reversed: ["excess", "imbalance"],
    meaning: "the right amount of two ingredients makes a third thing." },
  { id: 15, name: "The Devil", upright: ["attachment", "shadow", "appetite"], reversed: ["release", "awakening"],
    meaning: "the chains are loose. you put them on yourself; you can take them off." },
  { id: 16, name: "The Tower", upright: ["upheaval", "revelation", "collapse"], reversed: ["averted", "fear of change"],
    meaning: "what was built on a bad foundation is coming down. let it." },
  { id: 17, name: "The Star", upright: ["hope", "renewal", "clarity"], reversed: ["dim", "discouraged"],
    meaning: "after the storm, the small lights look very bright. follow one." },
  { id: 18, name: "The Moon", upright: ["dream", "illusion", "tide"], reversed: ["clarity", "release"],
    meaning: "not everything you see at night is real. wait until morning before you decide." },
  { id: 19, name: "The Sun", upright: ["joy", "vitality", "clarity"], reversed: ["dimmed", "delayed"],
    meaning: "permission to enjoy a thing without ironizing it." },
  { id: 20, name: "Judgement", upright: ["awakening", "reckoning", "call"], reversed: ["doubt", "self-judgment"],
    meaning: "you hear the trumpet whether you stand up or not." },
  { id: 21, name: "The World", upright: ["completion", "wholeness", "arrival"], reversed: ["unfinished", "lingering"],
    meaning: "a thing is finished. mark the moment before starting the next." },
]
