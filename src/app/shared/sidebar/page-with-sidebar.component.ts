import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { SidebarService } from './sidebar.service';
import { HostWindowService } from '../host-window.service';
import { combineLatest, Observable } from 'rxjs';
import { pushInOut } from '../animations/push';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'ds-page-with-sidebar',
  styleUrls: ['./page-with-sidebar.component.scss'],
  templateUrl: './page-with-sidebar.component.html',
  animations: [pushInOut],
})
/**
 * This component takes care of displaying the sidebar properly on all viewports. It does not
 * provide default buttons to open or close the sidebar. Instead the parent component is expected
 * to provide the content of the sidebar through an input. The main content of the page goes in
 * the template outlet (inside the page-width-sidebar tags).
 */
export class PageWithSidebarComponent implements OnInit {
  @Input() id: string;
  @Input() sidebarContent: TemplateRef<any>;

  /**
   * Emits true if were on a small screen
   */
  isXsOrSm$: Observable<boolean>;
  isMd$: Observable<boolean>;
  isLg$: Observable<boolean>;
  isXl$: Observable<boolean>;
  adjustLayout$: Observable<any>;
  isLoggedIn$: Observable<any>;

  /**
   * The width of the sidebar (bootstrap columns)
   */
  @Input()
  sideBarWidth = 3;

  /**
   * Observable for whether or not the sidebar is currently collapsed
   */
  isSidebarCollapsed$: Observable<boolean>;

  sidebarClasses: Observable<string>;

  @Input() increaseSideBarPadding:boolean = false;

  constructor(protected sidebarService: SidebarService,
              protected windowService: HostWindowService,
              public auth:AuthService
  ) {}

  ngOnInit(): void {
    this.isSidebarCollapsed$ = this.isSidebarCollapsed();
    this.sidebarClasses = this.isSidebarCollapsed$.pipe(
      map((isCollapsed) => isCollapsed ? '' : 'active')
    );
    this.isXsOrSm$ = this.windowService.isXsOrSm();
    this.isMd$ = this.windowService.isMd();
    this.isLg$ = this.windowService.isLg();
    this.isXl$ = this.windowService.isXl();
    this.isLoggedIn$ = this.auth.isAuthenticated();
    this.adjustLayout$ = combineLatest([this.isLoggedIn$, this.isXsOrSm$]).pipe(
      map(([loggedIn, isXsOrSm]) => ( loggedIn && !isXsOrSm))
    );
  }

  /**
   * Check if the sidebar is collapsed
   * @returns {Observable<boolean>} emits true if the sidebar is currently collapsed, false if it is expanded
   */
  private isSidebarCollapsed(): Observable<boolean> {
    return this.sidebarService.isCollapsed;
  }

  /**
   * Set the sidebar to a collapsed state
   */
  public closeSidebar(): void {
    this.sidebarService.collapse();
  }

  /**
   * Set the sidebar to an expanded state
   */
  public openSidebar(): void {
    this.sidebarService.expand();
  }

}
