from typing import Dict, Any

class CitizenResponseAgent:
    """
    Assists citizens in drafting formal, structured, and respectful submissions
    for public consultations, objections, petitions, and municipal representations.
    Adheres strictly to the citizen's specified concerns without fabricating personal facts.
    """

    @classmethod
    def generate_draft(
        cls,
        policy_title: str,
        policy_code: str,
        department: str,
        response_type: str,  # feedback, objection, support, rti, email
        citizen_position: str,
        concerns: str,
        user_ward: str = "Bengaluru Resident",
        specific_points: str = ""
    ) -> Dict[str, Any]:
        
        type_headers = {
            "feedback": "FORMAL CITIZEN FEEDBACK ON PUBLIC CONSULTATION",
            "objection": "FORMAL STATEMENT OF OBJECTION & PETITION UNDER MUNICIPAL ACT",
            "support": "STATEMENT OF COMMUNITY SUPPORT & RECOMMENDATIONS",
            "rti": "APPLICATION UNDER RIGHT TO INFORMATION (RTI) ACT, 2005",
            "email": "REPRESENTATION TO THE MUNICIPAL COMMISSIONER / WARD COMMITTEE"
        }

        header = type_headers.get(response_type.lower(), "CIVIC REPRESENTATION")

        salutation = f"To,\nThe Commissioner / Competent Authority,\n{department},\nBengaluru Bruhat Mahanagara Palike (BBMP),\nBengaluru, Karnataka."

        subject = f"Subject: {header} regarding '{policy_title}' (Notification Ref: {policy_code})"

        body_paragraphs = []
        body_paragraphs.append(f"Respected Sir/Madam,\n\nI am a resident of {user_ward}, writing to formally place on record my perspective on the draft notification titled \"{policy_title}\".")

        if response_type == "objection":
            body_paragraphs.append(
                f"POSITION: OBJECTION\n"
                f"As a resident directly impacted by the proposed measures, I wish to register my formal objection based on the following specific concerns:\n"
                f"1. Key Concern: {concerns}\n"
                f"2. Local Neighborhood Context: In {user_ward}, the existing infrastructure capacity requires careful re-assessment before enforcing these provisions.\n"
                f"{('3. Specific Request: ' + specific_points) if specific_points else ''}"
            )
            body_paragraphs.append(
                "In light of the above, I respectfully urge the municipal authorities to hold an open Ward Committee deliberation and reconsider the specified clauses prior to final gazette notification."
            )
        elif response_type == "support":
            body_paragraphs.append(
                f"POSITION: SUPPORT WITH CONSTRUCTIVE RECOMMENDATIONS\n"
                f"I welcome the progressive intent of \"{policy_title}\". However, to ensure smooth implementation on ground in {user_ward}, I highlight the following key observations:\n"
                f"- Primary Perspective: {concerns}\n"
                f"{('- Additional Suggestion: ' + specific_points) if specific_points else ''}"
            )
            body_paragraphs.append(
                "We encourage swift and transparent execution with regular ward-level progress reporting."
            )
        elif response_type == "rti":
            body_paragraphs.append(
                f"Under Section 6(1) of the RTI Act 2005, please provide the following certified information regarding \"{policy_title}\":\n"
                f"1. Copies of feasibility/impact assessment reports conducted for {user_ward}.\n"
                f"2. Specific details regarding public consultation timeline and summary of received submissions regarding: {concerns}.\n"
                f"3. Designated nodal officer contact details responsible for implementation."
            )
        else:
            body_paragraphs.append(
                f"OBSERVATIONS & CITIZEN FEEDBACK:\n"
                f"Regarding the proposed provisions in {user_ward}:\n"
                f"- Stance/Observation: {concerns}\n"
                f"{('- Additional Note: ' + specific_points) if specific_points else ''}"
            )
            body_paragraphs.append(
                "Thank you for facilitating public participation and considering citizen inputs in the policymaking process."
            )

        closing = f"Yours faithfully,\n[Resident of {user_ward}]\n(Draft generated via JanVaani Civic Assistant for Citizen Review)"

        full_draft = f"=== {header} ===\n\n{salutation}\n\n{subject}\n\n" + "\n\n".join(body_paragraphs) + f"\n\n{closing}"

        return {
            "status": "success",
            "header": header,
            "response_type": response_type,
            "policy_code": policy_code,
            "policy_title": policy_title,
            "full_draft": full_draft,
            "is_draft": True,
            "disclaimer": "This is a citizen-assisted draft. Review and personalize the details before official submission."
        }
