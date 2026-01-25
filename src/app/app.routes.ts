import { Routes } from '@angular/router';
import { authGuard, adminGuard, guestGuard } from './guards/auth.guards';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./home/home').then(m => m.Home)
    },
    {
        path: 'login',
        loadComponent: () => import('./login/login').then(m => m.Login),
        canActivate: [guestGuard]
    },
    {
        path: 'signup',
        loadComponent: () => import('./signup/signup').then(m => m.Signup),
        canActivate: [guestGuard]
    },
    {
        path: 'puzzles',
        loadComponent: () => import('./puzzles/puzzles').then(m => m.Puzzles)
    },
    {
        path: 'independents',
        loadComponent: () => import('./game-of-independence/game-of-independence').then(m => m.GameOfIndependence)
    },
    {
        path: 'dominance',
        loadComponent: () => import('./dominance/dominance').then(m => m.Dominance)
    },
    {
        path: 'coordinates',
        loadComponent: () => import('./coordinates/coordinates').then(m => m.Coordinates)
    },
    {
        path: 'knights-tour',
        loadComponent: () => import('./knights-tour/knights-tour').then(m => m.KnightsTour)
    },
    {
        path: 'capture-the-shapes',
        loadComponent: () => import('./capture-the-shapes/capture-the-shapes').then(m => m.CaptureTheShapes)
    },
    {
        path: 'quiz',
        loadComponent: () => import('./quiz/quiz').then(m => m.Quiz)
    },
    {
        path: 'admin',
        loadComponent: () => import('./admin/admin').then(m => m.Admin),
        canActivate: [adminGuard]
    },
    {
        path: 'donate',
        loadComponent: () => import('./donate/donate').then(m => m.Donate)
    },
    {
        path: 'terms',
        loadComponent: () => import('./terms/terms').then(m => m.TermsComponent)
    },
    {
        path: 'privacy',
        loadComponent: () => import('./privacy/privacy').then(m => m.PrivacyComponent)
    },
    {
        path: 'contact',
        loadComponent: () => import('./contact/contact').then(m => m.ContactComponent)
    },
    {
        path: 'about-school',
        loadComponent: () => import('./about-school/about-school').then(m => m.AboutSchool)
    },
    {
        path: 'coaches',
        loadComponent: () => import('./coaches/coaches').then(m => m.Coaches)
    },
    {
        path: 'testimonials',
        loadComponent: () => import('./testimonials/testimonials').then(m => m.Testimonials)
    },
    {
        path: 'gallery',
        loadComponent: () => import('./gallery/gallery').then(m => m.Gallery)
    },
    {
        path: 'books',
        loadComponent: () => import('./books/books').then(m => m.Books)
    },
    {
        path: 'classes',
        redirectTo: 'about-school',
        pathMatch: 'full'
    }
];
