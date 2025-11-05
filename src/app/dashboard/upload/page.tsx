import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories, software } from "@/lib/data";
import { Upload } from "lucide-react";

export default function UploadPage() {
  return (
    <div className="grid gap-6">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold font-headline">Upload New Product</h1>
        </div>
      <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>
              Fill out the information for your new preset or LUT pack.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Title</Label>
              <Input
                id="name"
                placeholder="e.g., Cinematic Film Presets"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what makes your product unique..."
                className="min-h-[120px]"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                 <div className="grid gap-2">
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" type="number" placeholder="15.00" />
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                        <SelectTrigger id="category">
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>
             <div className="grid gap-2">
                <Label>Compatible Software</Label>
                <p className="text-sm text-muted-foreground">Select all that apply.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {software.map(s => (
                        <Button key={s.id} variant="outline">{s.name}</Button>
                    ))}
                </div>
            </div>
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Product Media</CardTitle>
                <CardDescription>Upload before & after images, and your product file.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-2">
                    <Label>Preview Images</Label>
                     <div className="flex items-center justify-center w-full">
                        <Label htmlFor="dropzone-file-images" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-2 text-muted-foreground"/>
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> 'before' and 'after' images</p>
                            </div>
                            <Input id="dropzone-file-images" type="file" className="hidden" multiple/>
                        </Label>
                    </div> 
                </div>
                <div className="grid gap-2">
                    <Label>Product File (.zip)</Label>
                     <div className="flex items-center justify-center w-full">
                        <Label htmlFor="dropzone-file-product" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-2 text-muted-foreground"/>
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> your .zip file</p>
                            </div>
                            <Input id="dropzone-file-product" type="file" className="hidden" accept=".zip"/>
                        </Label>
                    </div> 
                </div>
            </CardContent>
        </Card>
         <div className="flex items-center justify-end gap-2">
          <Button variant="outline">Save as Draft</Button>
          <Button>Publish Product</Button>
        </div>
      </div>
    </div>
  );
}
