import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/shared/ui/components/ui/dialog';
import { Method } from '@/core/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/shared/ui/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/shared/ui/components/ui/select';
import { Input } from '@/src/shared/ui/components/ui/input';
import { Textarea } from '@/src/shared/ui/components/ui/textarea';
import { Button } from '@/src/shared/ui/components/ui/button';
import { useEffect } from 'react';

const formSchema = z.object({
  endpoint: z.url('Please enter a valid URL'),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
  body: z.string().optional(),
});

interface HttpRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  defaultEndpoint?: string;
  defaultMethod?: Method;
  defaultBody?: string;
}

export function HttpRequestDialog(props: HttpRequestDialogProps) {
  const { open, onOpenChange, defaultEndpoint, defaultMethod, defaultBody, onSubmit } = props;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      endpoint: defaultEndpoint,
      method: defaultMethod,
      body: defaultBody,
    },
  });

  const watchMethod = form.watch('method');
  const showBodyField = ['POST', 'PUT', 'PATCH'].includes(watchMethod as string);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
    onOpenChange(false);
  };

  useEffect(() => {
    if (open) {
      form.reset({
        endpoint: defaultEndpoint,
        method: defaultMethod,
        body: defaultBody,
      });
    }
  }, [open, defaultEndpoint, defaultMethod, defaultBody, form]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Http Request</DialogTitle>
          <DialogDescription>Configure setting for the HTTP request node.</DialogDescription>
          <div className="py-4">
            <div className="text-muted-foreground text-sm">
              Used to manually create a workflow, no configuration available.
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form className="mt-4 space-y-8" onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="select a method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>The HTTP method to use for this request.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endpoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endpoint Url</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={'https://api.example.com/users/{{httpResponse.data.id}}'}
                    />
                  </FormControl>
                  <FormDescription>
                    Static URL or use {'{{variables}}'} for simple values or {'{{json variables}}'}{' '}
                    to stringify objects.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {showBodyField && (
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endpoint Url</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="min-h-[120px] font-mono text-sm"
                        placeholder={
                          '{\n  "userId": "{{httpResponse.data.name}}",\n  "name": {{httpResponse.data.name}\n  "items": {{httpResponse.data.items}\n}}'
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      JSON with template variables. Use {'{{variables}}'} for simple values or{' '}
                      {'{{json variables}}'} to stringify objects.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <DialogFooter>
              <Button className="mt-4" type="submit">
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
