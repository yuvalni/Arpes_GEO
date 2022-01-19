from bokeh.layouts import row, column
from bokeh.plotting import figure, show, output_file,save
from bokeh.models import Slider
import numpy as np

def sin(x):
    return np.sin(x*np.pi/180)

def cos(x):
    return np.cos(x*np.pi/180)

def plot_slit(θ,τ,ϕ,hv=2.1):
    #conversion = 0.74
    δ = np.linspace(-15,15,50);
    conversion = 0.51 * np.sqrt(hv)
    a=5.4/np.sqrt(2)
    prange = np.pi/a
    #kx = conve000rsion*(sin(τ+δ)*cos(θ)*cos(ϕ) + sin(θ)*cos(τ+δ)*sin(ϕ))
    #ky = conversion*(sin(τ+δ)*cos(θ)*sin(ϕ) + sin(θ)*cos(ϕ))

    #slit_x = conversion*(sin(τ)*cos(ϕ) + sin(θ)*sin(ϕ))
    #slit_y = conversion*(sin(τ)*sin(ϕ) + sin(θ)*cos(ϕ))
    #slit_x = conversion*(sin(τ)*cos(θ)*cos(ϕ) + sin(θ)*sin(ϕ))
    #slit_y = conversion*(sin(τ)*cos(θ)*sin(ϕ) + sin(θ)*cos(ϕ))

    _ky = a/np.pi*conversion*(sin(δ)*cos(τ)+cos(δ)*sin(τ)*cos(θ))
    _kx = a/np.pi*conversion*(cos(δ)*sin(θ))

    ky = _ky*cos(ϕ) + _kx*sin(ϕ)
    kx = _kx*cos(ϕ) - _ky*sin(ϕ)


    _slit_y = a/np.pi*conversion*(sin(τ)*cos(θ))
    _slit_x = a/np.pi*conversion*sin(θ)

    slit_y = _slit_y*cos(ϕ) + _slit_x*sin(ϕ)
    slit_x = _slit_x*cos(ϕ) - _slit_y*sin(ϕ)


    p1.line(kx,ky,line_width=4)
    p1.scatter(slit_x,slit_y,size=6,color='black')
    return kx,ky


def BSCO_tightBinding(kx,ky):
    Kx, Ky = np.meshgrid(kx,ky)
    t = 0.36
    t1 = -0.28*t
    t2 = 0.1*t
    t3 = 0.03*t
    a=5.4/np.sqrt(2)
    #-2*t*(Cos[kx*a] + Cos[ky*a]) - t' (Cos[kx/a] Cos[ky/a]) - 2 t'' (Cos[kx*2 a] + Cos[ky*2 a]) - t''' (Cos[kx*2 a] Cos[ky*a] + Cos[ky*2 a] Cos[kx*a])
    E = -2*t*(np.cos(Kx*a)+np.cos(Ky*a)) - t1*(np.cos(Kx*a)*np.cos(Ky*a))-2*t2*(np.cos(2*Kx*a)+np.cos(Ky*2*a))-t3*(np.cos(Kx*2*a)*np.cos(Ky*a)+np.cos(2*Ky*a)*np.cos(Kx*a))
    return E


def BSCO_tightBinding_function(kx,ky):
    Kx=kx
    Ky=ky
    t = 0.36
    t1 = -0.28*t
    t2 = 0.1*t
    t3 = 0.03*t
    a=5.4/np.sqrt(2)
    #-2*t*(Cos[kx*a] + Cos[ky*a]) - t' (Cos[kx/a] Cos[ky/a]) - 2 t'' (Cos[kx*2 a] + Cos[ky*2 a]) - t''' (Cos[kx*2 a] Cos[ky*a] + Cos[ky*2 a] Cos[kx*a])

    E = -2*t*(np.cos(Kx*a)+np.cos(Ky*a)) - t1*(np.cos(Kx*a)*np.cos(Ky*a))-2*t2*(np.cos(2*Kx*a)+np.cos(Ky*2*a))-t3*(np.cos(Kx*2*a)*np.cos(Ky*a)+np.cos(2*Ky*a)*np.cos(Kx*a))
    return E

def Spectral_function(kx,ky,E,Sigmat=5,T=90,sigma=0.1):
    Kb = 8.617333262145*10**(-5) #eV/K
    Ed = BSCO_tightBinding_function(kx,ky)

    wt = np.linspace(E-2*sigma,E+2*sigma,10)
    sigma_sqrt_2pi = sigma*np.sqrt(2*np.pi)

    I = 0
    if T!=0:
        FD = 1/(np.exp(E/(Kb*T))+1)
    else:
        if E<0:
            FD = 1
        else:
            FD = 0

    if sigma == 0:
        return Sigmat/((E-Ed)**2+Sigmat**2)*FD

    for _wt in wt:
        I+= Sigmat/((_wt-Ed)**2+Sigmat**2)* FD * np.exp(-1/2*(E - _wt)**2/(sigma**2))/sigma_sqrt_2pi
    return I


a=5.4/np.sqrt(2)
kx = np.linspace(-np.pi/a,np.pi/a)
ky = np.linspace(-np.pi/a,np.pi/a)

R=0
tilt=45
phi=45

p1 = figure(title="Bi2212 BZ", x_axis_label='pi/a', y_axis_label='pi/a',y_range=(-1, 1),x_range=(-1,1),tools=[])


slit_kx,slit_ky = plot_slit(R,tilt,phi)

Etop = 0.2
Eb = -0.4
xlim_d = np.min(np.sqrt(slit_kx**2+slit_ky**2))
xlim_u =np.max(np.sqrt(slit_kx**2+slit_ky**2))
p2 = figure(title="Intensity", x_axis_label='k_par', y_axis_label='E_b',y_range=(Eb, Etop),x_range=(xlim_d,xlim_u),tools=[])

E = np.linspace(Eb,Etop,100)

spectral_image = np.zeros((100,50))
for j in range(len(slit_kx)):
    _j = len(slit_kx)-j-1
    for i,_E in enumerate(E):
        spectral_image[i,_j] = Spectral_function(slit_kx[j],slit_ky[j],_E,T=90,Sigmat=0.05,sigma=0.01)

p2.image(image=[spectral_image],x=xlim_d, y=Eb, dw=xlim_u-xlim_d, dh=Etop-Eb, palette="Inferno256")




output_file(filename="custom_filename.html", title="Static HTML file")
save(row(p1,p2))
