<script setup>
import educatorLogo from "../../../assets/educatorlogo.png";
import LogoText from "../../../assets/images/logo-text.svg";
import LogoWhiteText from "../../../assets/images/logo-text-white.svg";

const emit = defineEmits(["navigate"]);
</script>

<template>
  <aside class="app-menubar" id="appMenubar">
    <div class="app-navbar-brand">
      <a class="navbar-brand-logo" href="index.html">
        <img alt="GXON Admin Dashboard Logo" :src="educatorLogo" class="app-logo"/>
      </a>
      <!-- <a class="navbar-brand-mini visible-light" href="index.html">
        <img
          alt="GXON Admin Dashboard Logo"
          :src="educatorLogo"
        />
      </a> -->
      <a class="navbar-brand-mini visible-dark" href="index.html">
        <img
          alt="GXON Admin Dashboard Logo"
          :src="LogoWhiteText"
        />
      </a>
    </div>
    <nav class="app-navbar" data-simplebar="">
      <ul class="menubar">
        <li class="menu-item menu-arrow">
          <a class="menu-link" href="#" role="button">
            <i class="fi fi-rr-apps"></i>
            <span class="menu-label">Dashboard</span>
          </a>
          <ul class="menu-inner">
            <li class="menu-item">
              <a class="menu-link" href="index.html">
                <span class="menu-label">Dashboard</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="index-rtl.html">
                <span class="menu-label">Dashboard RTL</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="ecommerce/ecommerce.html">
                <span class="menu-label">E-Commerce</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="employee.html">
                <span class="menu-label">Employee</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="attendance.html">
                <span class="menu-label">Attendance</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="leave.html">
                <span class="menu-label">Leave</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="payroll.html">
                <span class="menu-label">Payroll</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="recruitment.html">
                <span class="menu-label">Recruitment</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="task-management.html">
                <span class="menu-label">Task Management</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="analytics.html">
                <span class="menu-label">Analytics</span>
              </a>
            </li>
          </ul>
        </li>
        <li class="menu-heading">
          <span class="menu-label">Apps &amp; Pages</span>
        </li>
        <li class="menu-item">
          <a class="menu-link" href="chat.html">
            <i class="fi fi-rr-comment"></i>
            <span class="menu-label">Chat</span>
          </a>
        </li>
        <li class="menu-item">
          <a class="menu-link" href="calendar.html">
            <i class="fi fi-rr-calendar"></i>
            <span class="menu-label">Calendar</span>
          </a>
        </li>
        <li class="menu-item menu-arrow">
          <a class="menu-link" href="#" role="button">
            <i class="fi fi-rr-envelope"></i>
            <span class="menu-label">Email</span>
          </a>
          <ul class="menu-inner">
            <li class="menu-item">
              <a class="menu-link" href="email/inbox.html">
                <span class="menu-label">Inbox</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="email/compose.html">
                <span class="menu-label">Compose</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="email/read-email.html">
                <span class="menu-label">Read email</span>
              </a>
            </li>
          </ul>
        </li>
        <li class="menu-item menu-arrow">
          <a class="menu-link" href="#" role="button">
            <i class="fi fi-rr-file"></i>
            <span class="menu-label">Pages</span>
          </a>
          <ul class="menu-inner">
            <li class="menu-item">
              <a class="menu-link" href="pages/pricing.html">
                <span class="menu-label">Pricing</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="pages/pricing-two.html">
                <span class="menu-label">Pricing 2</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="pages/faq.html">
                <span class="menu-label">FAQ's</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="pages/coming-soon.html">
                <span class="menu-label">Coming Soon</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="profile.html">
                <span class="menu-label">Profile</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="roles-permissions.html">
                <span class="menu-label">Roles Permissions</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="settings.html">
                <span class="menu-label">Settings</span>
              </a>
            </li>
            <li class="menu-item menu-arrow">
              <a class="menu-link" href="#">
                <span class="menu-label">Blog</span>
              </a>
              <ul class="menu-inner">
                <li class="menu-item">
                  <a class="menu-link" href="pages/blog.html">
                    <span class="menu-label">Blog Grid</span>
                  </a>
                </li>
                <li class="menu-item">
                  <a class="menu-link" href="pages/blog-list.html">
                    <span class="menu-label">Blog List</span>
                  </a>
                </li>
                <li class="menu-item">
                  <a class="menu-link" href="pages/blog-details.html">
                    <span class="menu-label">Blog Details</span>
                  </a>
                </li>
              </ul>
            </li>
            <li class="menu-item menu-arrow">
              <a class="menu-link" href="#">
                <span class="menu-label">Error</span>
              </a>
              <ul class="menu-inner">
                <li class="menu-item">
                  <a class="menu-link" href="pages/error-404.html">
                    <span class="menu-label">Basic</span>
                  </a>
                </li>
                <li class="menu-item">
                  <a class="menu-link" href="pages/error-404-cover.html">
                    <span class="menu-label">Cover</span>
                  </a>
                </li>
                <li class="menu-item">
                  <a class="menu-link" href="pages/error-404-full.html">
                    <span class="menu-label">Full</span>
                  </a>
                </li>
              </ul>
            </li>
            <li class="menu-item menu-arrow">
              <a class="menu-link" href="#">
                <span class="menu-label">Under Construction</span>
              </a>
              <ul class="menu-inner">
                <li class="menu-item">
                  <a class="menu-link" href="pages/under-construction.html">
                    <span class="menu-label">Basic</span>
                  </a>
                </li>
                <li class="menu-item">
                  <a
                    class="menu-link"
                    href="pages/under-construction-cover.html"
                  >
                    <span class="menu-label">Cover</span>
                  </a>
                </li>
                <li class="menu-item">
                  <a
                    class="menu-link"
                    href="pages/under-construction-full.html"
                  >
                    <span class="menu-label">Full</span>
                  </a>
                </li>
              </ul>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="pages/blank-page.html">
                <span class="menu-label">Blank Page</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="pages/activity.html">
                <span class="menu-label">Activity</span>
              </a>
            </li>
          </ul>
        </li>
        <li class="menu-item menu-arrow">
          <a class="menu-link" href="#" role="button">
            <i class="fi fi-rr-user-key"></i>
            <span class="menu-label">Authentication</span>
          </a>
          <ul class="menu-inner">
            <li class="menu-item menu-arrow">
              <a class="menu-link" href="#">
                <span class="menu-label">Login</span>
              </a>
              <ul class="menu-inner">
                <li class="menu-item">
                  <a class="menu-link" href="authentication/login-basic.html">
                    <span class="menu-label">Basic</span>
                  </a>
                </li>
                <li class="menu-item">
                  <a class="menu-link" href="authentication/login-cover.html">
                    <span class="menu-label">Cover</span>
                  </a>
                </li>
                <li class="menu-item">
                  <a class="menu-link" href="authentication/login-frame.html">
                    <span class="menu-label">Frame</span>
                  </a>
                </li>
              </ul>
            </li>
            <li class="menu-item menu-arrow">
              <a class="menu-link" href="#">
                <span class="menu-label">Register</span>
              </a>
              <ul class="menu-inner">
                <li class="menu-item">
                  <a
                    class="menu-link"
                    href="authentication/register-basic.html"
                  >
                    <span class="menu-label">Basic</span>
                  </a>
                </li>
                <li class="menu-item">
                  <a
                    class="menu-link"
                    href="authentication/register-cover.html"
                  >
                    <span class="menu-label">Cover</span>
                  </a>
                </li>
                <li class="menu-item">
                  <a
                    class="menu-link"
                    href="authentication/register-frame.html"
                  >
                    <span class="menu-label">Frame</span>
                  </a>
                </li>
              </ul>
            </li>
            <li class="menu-item menu-arrow">
              <a class="menu-link" href="#">
                <span class="menu-label">Forgot Password</span>
              </a>
              <ul class="menu-inner">
                <li class="menu-item">
                  <a
                    class="menu-link"
                    href="authentication/forgot-password-basic.html"
                  >
                    <span class="menu-label">Basic</span>
                  </a>
                </li>
                <li class="menu-item">
                  <a
                    class="menu-link"
                    href="authentication/forgot-password-cover.html"
                  >
                    <span class="menu-label">Cover</span>
                  </a>
                </li>
                <li class="menu-item">
                  <a
                    class="menu-link"
                    href="authentication/forgot-password-frame.html"
                  >
                    <span class="menu-label">Frame</span>
                  </a>
                </li>
              </ul>
            </li>
            <li class="menu-item menu-arrow">
              <a class="menu-link" href="#">
                <span class="menu-label">New Password</span>
              </a>
              <ul class="menu-inner">
                <li class="menu-item">
                  <a
                    class="menu-link"
                    href="authentication/new-password-basic.html"
                  >
                    <span class="menu-label">Basic</span>
                  </a>
                </li>
                <li class="menu-item">
                  <a
                    class="menu-link"
                    href="authentication/new-password-cover.html"
                  >
                    <span class="menu-label">Cover</span>
                  </a>
                </li>
                <li class="menu-item">
                  <a
                    class="menu-link"
                    href="authentication/new-password-frame.html"
                  >
                    <span class="menu-label">Frame</span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </li>
        <li class="menu-item menu-arrow">
          <a class="menu-link" href="#" role="button">
            <i class="fi fi-rr-folder-open"></i>
            <span class="menu-label">File Manager</span>
          </a>
          <ul class="menu-inner">
            <li class="menu-item">
              <a class="menu-link" href="file-manager/folders.html">
                <span class="menu-label">Folders</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="file-manager/files.html">
                <span class="menu-label">Files</span>
              </a>
            </li>
          </ul>
        </li>
        <li class="menu-item menu-arrow">
          <a class="menu-link" href="#" role="button">
            <i class="fi fi-rs-receipt"></i>
            <span class="menu-label">Invoice Manager</span>
          </a>
          <ul class="menu-inner">
            <li class="menu-item">
              <a class="menu-link" href="invoices/invoice1.html">
                <span class="menu-label">Invoice 1</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="invoices/invoice2.html">
                <span class="menu-label">Invoice 2</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="invoices/create-invoice.html">
                <span class="menu-label">Create Invoice</span>
              </a>
            </li>
          </ul>
        </li>
        <li class="menu-heading">
          <span class="menu-label">Components</span>
        </li>
        <li class="menu-item menu-arrow">
          <a class="menu-link" href="#" role="button">
            <i class="fi fi-rr-flux-capacitor"></i>
            <span class="menu-label">UI Components</span>
          </a>
          <ul class="menu-inner">
            <li class="menu-item">
              <a class="menu-link" href="components/accordion.html">
                <span class="menu-label">Accordion</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="components/alerts.html">
                <span class="menu-label">Alerts</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="components/badge.html">
                <span class="menu-label">Badge</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="components/breadcrumb.html">
                <span class="menu-label">Breadcrumb</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="components/buttons.html">
                <span class="menu-label">Buttons</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="components/typography.html">
                <span class="menu-label">Typography</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="components/button-group.html">
                <span class="menu-label">Button Group</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="components/card.html">
                <span class="menu-label">Card</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="components/collapse.html">
                <span class="menu-label">Collapse</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="components/carousel.html">
                <span class="menu-label">Carousel</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="components/dropdowns.html">
                <span class="menu-label">Dropdowns</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="components/modal.html">
                <span class="menu-label">Modal</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="components/navbar.html">
                <span class="menu-label">Navbar</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="components/list-group.html">
                <span class="menu-label">List Group</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="components/tabs.html">
                <span class="menu-label">Tabs</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="components/offcanvas.html">
                <span class="menu-label">Offcanvas</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="components/pagination.html">
                <span class="menu-label">Pagination</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="components/popovers.html">
                <span class="menu-label">Popovers</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="components/progress.html">
                <span class="menu-label">Progress</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="components/scrollspy.html">
                <span class="menu-label">Scrollspy</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="components/spinners.html">
                <span class="menu-label">Spinners</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="components/toasts.html">
                <span class="menu-label">Toasts</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="components/tooltips.html">
                <span class="menu-label">Tooltips</span>
              </a>
            </li>
          </ul>
        </li>
        <li class="menu-item menu-arrow">
          <a class="menu-link" href="#" role="button">
            <i class="fi fi-rr-apps-add"></i>
            <span class="menu-label">Extended UI</span>
          </a>
          <ul class="menu-inner">
            <li class="menu-item">
              <a class="menu-link" href="extended-ui/avatar.html">
                <span class="menu-label">Avatar</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="extended-ui/card-action.html">
                <span class="menu-label">Card action</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="extended-ui/drag-and-drop.html">
                <span class="menu-label">Drag &amp; drop</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="extended-ui/simplebar.html">
                <span class="menu-label">Simplebar</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="extended-ui/swiper.html">
                <span class="menu-label">Swiper</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="extended-ui/team.html">
                <span class="menu-label">Team</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="extended-ui/flags.html">
                <span class="menu-label">Flags</span>
              </a>
            </li>
          </ul>
        </li>
        <li class="menu-item menu-arrow">
          <a class="menu-link" href="#" role="button">
            <i class="fi fi-rr-bolt"></i>
            <span class="menu-label">Icons</span>
          </a>
          <ul class="menu-inner">
            <li class="menu-item">
              <a class="menu-link" href="icons/flaticon.html">
                <span class="menu-label">Flaticon</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="icons/lucide.html">
                <span class="menu-label">Lucide</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="icons/fontawesome.html">
                <span class="menu-label">Font Awesome</span>
              </a>
            </li>
          </ul>
        </li>
        <li class="menu-heading">
          <span class="menu-label">Forms &amp; Tables</span>
        </li>
        <li class="menu-item menu-arrow">
          <a class="menu-link" href="#" role="button">
            <i class="fi fi-rr-form"></i>
            <span class="menu-label">Form Elements</span>
          </a>
          <ul class="menu-inner">
            <li class="menu-item">
              <a class="menu-link" href="forms/form-elements.html">
                <span class="menu-label">Form Elements</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="forms/form-floating.html">
                <span class="menu-label">Form Floating</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="forms/form-input-group.html">
                <span class="menu-label">Form Input Group</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="forms/form-layout.html">
                <span class="menu-label">Form Layout</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="forms/form-validation.html">
                <span class="menu-label">Form Validation</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="forms/flatpickr.html">
                <span class="menu-label">Flatpickr</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="forms/tagify.html">
                <span class="menu-label">Tagify</span>
              </a>
            </li>
          </ul>
        </li>
        <li class="menu-item menu-arrow">
          <a class="menu-link" href="#" role="button">
            <i class="fi fi-rr-table-layout"></i>
            <span class="menu-label">Table</span>
          </a>
          <ul class="menu-inner">
            <li class="menu-item">
              <a class="menu-link" href="table/tables-basic.html">
                <span class="menu-label">Table</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="table/tables-datatable.html">
                <span class="menu-label">Datatable</span>
              </a>
            </li>
          </ul>
        </li>
        <li class="menu-heading">
          <span class="menu-label">Charts &amp; Maps</span>
        </li>
        <li class="menu-item menu-arrow">
          <a class="menu-link" href="#" role="button">
            <i class="fi fi-rr-chart-pie-alt"></i>
            <span class="menu-label">Charts</span>
          </a>
          <ul class="menu-inner">
            <li class="menu-item">
              <a class="menu-link" href="chart/apexchart.html">
                <span class="menu-label">Apex Chart</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="chart/chartjs.html">
                <span class="menu-label">Chart JS</span>
              </a>
            </li>
          </ul>
        </li>
        <li class="menu-item menu-arrow">
          <a class="menu-link" href="#" role="button">
            <i class="fi fi-rr-marker"></i>
            <span class="menu-label">Maps</span>
          </a>
          <ul class="menu-inner">
            <li class="menu-item">
              <a class="menu-link" href="maps/jsvectormap.html">
                <span class="menu-label">JS Vector Map</span>
              </a>
            </li>
            <li class="menu-item">
              <a class="menu-link" href="maps/leaflet.html">
                <span class="menu-label">Leaflet</span>
              </a>
            </li>
          </ul>
        </li>
        <li class="menu-heading">
          <span class="menu-label">Others</span>
        </li>
        <li class="menu-item">
          <a class="menu-link" href="#">
            <i class="fi fi-rs-badget-check-alt"></i>
            <span class="menu-label">Badge</span>
            <span
              class="badge badge-sm rounded-pill bg-secondary ms-2 float-end"
              >5</span
            >
          </a>
        </li>
        <li class="menu-item">
          <a
            class="menu-link"
            href="https://gxon.layoutdrop.com/doc/changelog.html"
            target="_blank"
          >
            <i class="fi fi-rr-square-terminal"></i>
            <span class="menu-label">Changelog v1.5.0</span>
          </a>
        </li>
        <li class="menu-item menu-arrow">
          <a class="menu-link" href="#" role="button">
            <i class="fi fi-rs-floor-layer"></i>
            <span class="menu-label">Multi Level</span>
          </a>
          <ul class="menu-inner">
            <li class="menu-item menu-arrow">
              <a class="menu-link" href="#">
                <span class="menu-label">Multi Level 2</span>
              </a>
              <ul class="menu-inner">
                <li class="menu-item">
                  <a class="menu-link" href="#">
                    <span class="menu-label">Multi Level 3</span>
                  </a>
                </li>
                <li class="menu-item">
                  <a class="menu-link" href="#">
                    <span class="menu-label">Multi Level 3</span>
                  </a>
                </li>
                <li class="menu-item">
                  <a class="menu-link" href="#">
                    <span class="menu-label">Multi Level 3</span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
    <div class="app-footer">
      <a
        class="btn btn-outline-light waves-effect btn-shadow btn-app-nav w-100"
        href="pages/faq.html"
      >
        <i class="fi fi-rs-interrogation text-primary"></i>
        <span class="nav-text">Help and Support</span>
      </a>
    </div>
  </aside>
</template>
