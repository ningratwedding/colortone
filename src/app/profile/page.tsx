import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { users } from "@/lib/data";

export default function ProfilePage() {
    const user = users[0];

  return (
    <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 font-headline">My Profile</h1>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Public Profile</CardTitle>
                    <CardDescription>
                        This information will be displayed publicly.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={user.avatar.imageUrl} data-ai-hint={user.avatar.imageHint} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex gap-2">
                            <Button>Change Photo</Button>
                            <Button variant="outline">Remove</Button>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={user.name} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            defaultValue={user.bio}
                            placeholder="Tell us a little bit about yourself"
                            className="min-h-[100px]"
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button>Save Changes</Button>
                </CardFooter>
            </Card>
        </div>
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button>Update Password</Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
