import { ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, inject, Injectable, signal, Type } from "@angular/core";
import { DialogRef } from "./dialog.ref";
import { DEFAULT_CONFIG, DialogConfig } from "./dialog.config";
import { SlDialogComponent } from "./sl-dialog.component";

@Injectable({
    providedIn: 'root'
  })
  export class DialogService {
    private readonly dialogs = signal<DialogRef[]>([]);
    private dialogCounter = 0;
    
    private appRef = inject(ApplicationRef);
    private environmentInjector = inject(EnvironmentInjector);
    
    /**
     * Opens a dialog with the provided component and configuration
     */
    open<T, R = any>(
      content: Type<T>,
      config: DialogConfig = {}
    ): DialogRef<T, R> {
      // Merge default config with the provided one
      const dialogConfig = { ...DEFAULT_CONFIG, ...config };
      
      // Create dialog id
      const dialogId = `sl-dialog-${this.dialogCounter++}`;
      
      // Create DialogRef instance
      const dialogRef = new DialogRef<T, R>(dialogId);
      
      // Create the dialog component
      const dialogComponentRef = this.createDialogComponent(dialogConfig, dialogRef);
      
      // Create the content component
      const contentComponentRef = this.createContentComponent(content, dialogComponentRef, dialogConfig.data);
      
      // Set component instance
      dialogRef.setComponentInstance(contentComponentRef.instance);
      
      // Update dialogs list
      this.dialogs.update(dialogs => [...dialogs, dialogRef]);
      
      // Show the dialog
      setTimeout(() => {
        dialogRef.open();
      });
      
      return dialogRef;
    }
    
    /**
     * Creates a dialog container component
     */
    private createDialogComponent<T, R>(
      config: DialogConfig,
      dialogRef: DialogRef<T, R>
    ): ComponentRef<SlDialogComponent> {
      // Create the component
      const componentRef = createComponent(SlDialogComponent, {
        environmentInjector: this.environmentInjector
      });
      
      // Get the component instance
      const dialogComponent = componentRef.instance;
           
      // Handle events
      dialogComponent.closed.subscribe((result) => {
        this.removeDialog(dialogRef);
        dialogRef.close(result);
        this.destroyComponent(componentRef);
      });
      
      // Attach to DOM
      document.body.appendChild(componentRef.location.nativeElement);
      this.appRef.attachView(componentRef.hostView);
      
      return componentRef;
    }
    
    /**
     * Creates a content component inside the dialog
     */
    private createContentComponent<T>(
      component: Type<T>,
      dialogComponentRef: ComponentRef<SlDialogComponent>,
      data?: any
    ): ComponentRef<T> {
      // Create the content component
      const contentComponentRef = createComponent(component, {
        environmentInjector: this.environmentInjector
      });
      
      // Inject data if provided
      if (data && contentComponentRef.instance) {
        Object.assign(contentComponentRef.instance, { data });
      }
      
      // Find the content container and attach the component
      const contentContainer = dialogComponentRef.location.nativeElement.querySelector('.sl-dialog-content');
      contentContainer.appendChild(contentComponentRef.location.nativeElement);
      
      // Attach view
      this.appRef.attachView(contentComponentRef.hostView);
      
      return contentComponentRef;
    }
    
    /**
     * Removes a dialog from the list
     */
    private removeDialog(dialogRef: DialogRef): void {
      this.dialogs.update(dialogs => dialogs.filter(d => d !== dialogRef));
    }
    
    /**
     * Destroys a component
     */
    private destroyComponent(componentRef: ComponentRef<any>): void {
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
    }
}