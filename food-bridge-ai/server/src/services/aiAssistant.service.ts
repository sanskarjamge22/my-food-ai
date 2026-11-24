import { config } from '../config';

export interface AssistantMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class AiAssistantService {
  /**
   * Process a message sent by the user in the AI Food Waste Assistant
   */
  static async handleChat(
    messages: AssistantMessage[],
    userContext?: { role?: string; name?: string }
  ): Promise<{ reply: string; suggestions?: string[]; safetyNotice?: string }> {
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    const query = lastUserMessage.toLowerCase();

    // If an external LLM key is configured and not in mock mode, we could query Gemini API
    if (config.geminiApiKey && !config.aiMockMode) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: `You are the Food Bridge AI Assistant, a food rescue and safety expert.
Important food safety rules:
- NEVER declare food safe merely based on appearance or photographs.
- If food is uncertain, temperature-abused, or smells off, advise safe disposal or composting.
- Provide practical advice for donating surplus food, food categories, safe storage, and volunteer delivery.
User context: ${JSON.stringify(userContext || {})}
Conversation:
${messages.map(m => `${m.role}: ${m.content}`).join('\n')}
`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (response.ok) {
          const data = (await response.json()) as any;
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return {
              reply: text,
              safetyNotice:
                'AI Safety Notice: Automated advice does not replace certified public health inspections. Always verify temperature, freshness, and packaging before distribution.',
            };
          }
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to rule-based assistant:', err);
      }
    }

    // High quality intelligent domain-trained local mock mode
    let reply = '';
    let suggestions: string[] = [
      'How do I package hot cooked meals safely?',
      'What are the collection urgency thresholds?',
      'How does the AI smart matching score work?',
      'Help me generate a donation description for 30 Biryani boxes',
    ];

    if (query.includes('safe') || query.includes('spoil') || query.includes('smell') || query.includes('bacteria') || query.includes('temperature')) {
      reply = `🛡️ **Food Safety Protocol & Safe Handling Guidelines**

1. **Temperature Danger Zone (5°C to 60°C):**
   - **Hot Cooked Food:** Must be kept above 60°C (140°F) until collection or cooled rapidly from 60°C to 5°C within 2 hours.
   - **Chilled Food & Dairy:** Must be held continuously at or below 4°C (40°F).
2. **Maximum Collection Window:** Cooked food without refrigeration should be collected and served within **3 to 4 hours** of preparation.
3. **Packaging Requirements:** Use clean, food-grade, leak-proof containers. Clearly label preparation date, time, and potential allergens (peanuts, gluten, dairy).
4. **Mandatory Disclaimer:** If food smells sour, looks slimy, or was left uncovered in the danger zone for more than 2 hours, **do not donate**. Direct it to organic composting instead.`;
      suggestions = [
        'How to label allergens properly?',
        'Can I donate banquet surplus food?',
        'What is the shelf life of bakery goods?',
      ];
    } else if (query.includes('how to donate') || query.includes('donate surplus') || query.includes('steps')) {
      reply = `🍲 **How to Donate Surplus Food on Food Bridge AI**

1. **Check Food Safety First:** Ensure the surplus food was prepared under hygienic conditions and remains well within its safe consumption window.
2. **Go to "Donate Food":** Click the **"Donate Food"** button on your dashboard.
3. **Fill Details:**
   - Name and category (Cooked Meals, Bakery, Produce, etc.)
   - Approximate quantity and unit (kg, meals, or boxes)
   - Preparation timestamp and safe collection deadline
   - Storage condition (Room Temp, Refrigerated, Warm)
   - Pickup address and contact phone
4. **AI Smart Match:** Our engine immediately computes distance, urgency, and capacity to alert the best-fitting verified NGOs and food banks nearby!
5. **Approve Request & Dispatch:** When an NGO requests your listing, approve it with one click. A volunteer delivery partner will be routed to your pickup location.`;
      suggestions = [
        'How do I view matching NGOs?',
        'What units can I use for donations?',
        'Who coordinates volunteer delivery?',
      ];
    } else if (query.includes('match') || query.includes('algorithm') || query.includes('score') || query.includes('percentage')) {
      reply = `⚡ **How the AI Smart Matching Engine Calculates Scores**

Our multi-factor matching algorithm balances 4 critical dimensions:

- **Distance (35%):** Proximity between donor pickup location and NGO distribution center using the Haversine great-circle formula. Highest score for radius < 5 km.
- **Urgency (30%):** Remaining time until collection deadline. Imminent deadlines (< 2 hours) prioritize the closest high-speed response partners.
- **Quantity Suitability (20%):** Matches the donation batch size with the receiver's absorption capacity to prevent secondary waste.
- **Receiver Capacity & Verification (15%):** Prioritizes verified NGOs, food banks, and shelters with active volunteer networks and cold storage facilities.

Each match provides a transparent breakdown of reasons so donors and receivers know exactly why a pairing is recommended.`;
      suggestions = [
        'How do NGOs get verified?',
        'What happens when food is marked Critical urgency?',
        'Can an NGO reject a donation?',
      ];
    } else if (query.includes('description') || query.includes('generate') || query.includes('write') || query.includes('title')) {
      reply = `✨ **Generated Donation Listing Suggestion**

**Title:** Surplus Fresh Veg Dum Biryani & Raita (Approx 35 Meals)
**Category:** Cooked Meals
**Storage:** Keep warm or refrigerate immediately
**Allergens:** Contains dairy (Ghee/Curd). Nut-free.
**Description:** Freshly prepared surplus lunch from corporate catering event. Packed in insulated food-grade aluminum trays, handled with gloves, and untouched. Perfect for immediate community distribution within the next 3 hours.
**Pickup Address:** Bandra Kurla Complex, Mumbai
**Safe Collection Deadline:** Today by 4:00 PM`;
      suggestions = [
        'Generate description for leftover bakery pastries',
        'Generate description for 50kg fresh apples',
        'How to list refrigerated dairy products?',
      ];
    } else if (query.includes('status') || query.includes('lifecycle') || query.includes('track')) {
      reply = `📊 **Donation Lifecycle Statuses Explained**

- **AVAILABLE:** Published and visible for eligible NGOs to discover and request.
- **REQUESTED:** An NGO or food bank has submitted a request for all or part of the food.
- **APPROVED:** The donor approved the request, reserving the batch for that organization.
- **ASSIGNED:** A volunteer delivery partner has accepted the pickup task.
- **PICKED UP:** Volunteer has arrived at the donor location, verified the package, and is in transit.
- **DELIVERED:** Volunteer handed over the food to the NGO with photo/signature confirmation.
- **EXPIRED:** Safe collection window ended before pickup. Listing automatically closed to safeguard public health.`;
      suggestions = [
        'How can volunteers accept tasks?',
        'How do admins monitor donations?',
        'Can I cancel an approved request?',
      ];
    } else {
      reply = `Hello! I am your **Food Bridge AI Assistant** 🌿.

I can assist you with:
- **Food Safety & Storage:** Temperature danger zones, packaging requirements, and safe holding times.
- **Donation Guide:** How restaurants, hotels, and caterers can publish surplus food.
- **Smart Matching Engine:** How the 4-factor scoring algorithm matches donations to nearby NGOs.
- **Description Generator:** Drafting clear, appealing listing titles and allergen notices.
- **Volunteer Coordination:** Tracking pickups, live maps, and delivery confirmations.

How can I assist your food rescue mission today?`;
    }

    return {
      reply,
      suggestions,
      safetyNotice:
        '⚠️ Food Bridge AI Safety Standard: Never donate spoiled food. Cooked food must be kept outside the danger zone (5°C–60°C) and consumed within safe limits.',
    };
  }
}
