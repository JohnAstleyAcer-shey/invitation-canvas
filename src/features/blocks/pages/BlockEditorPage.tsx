import { useParams } from "react-router-dom";
import { useInvitation } from "@/features/admin/hooks/useInvitations";
import { BlockEditor } from "../components/BlockEditor";

export default function BlockEditorPage() {
  const { id } = useParams<{ id: string }>();
  const { data: invitation, isLoading } = useInvitation(id!);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-8 w-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Invitation not found</p>
      </div>
    );
  }

  return <BlockEditor invitationId={invitation.id} invitationTitle={invitation.title} invitationSlug={invitation.slug} />;
}
