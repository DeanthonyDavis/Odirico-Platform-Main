from pathlib import Path
from PIL import Image
import numpy as np
import math, sys, json
OUT=Path(sys.argv[1]); OUT.mkdir(parents=True,exist_ok=True)
SOURCE=Path(sys.argv[2])
im=Image.open(SOURCE).convert('L')
def contours(gray):
 a=np.asarray(gray,dtype=float); h,w=a.shape; graph={}; coords={}
 cases={1:[(3,0)],2:[(0,1)],3:[(3,1)],4:[(1,2)],5:[(3,0),(1,2)],6:[(0,2)],7:[(3,2)],8:[(2,3)],9:[(0,2)],10:[(0,1),(2,3)],11:[(1,2)],12:[(1,3)],13:[(0,1)],14:[(3,0)]}
 def edge(x,y,e,v):
  tl,tr,br,bl=v
  if e==0: k=('h',x,y); p=(x+(128-tl)/(tr-tl)+.5,y+.5)
  elif e==1: k=('v',x+1,y); p=(x+1.5,y+(128-tr)/(br-tr)+.5)
  elif e==2: k=('h',x,y+1); p=(x+(128-bl)/(br-bl)+.5,y+1.5)
  else: k=('v',x,y); p=(x+.5,y+(128-tl)/(bl-tl)+.5)
  coords[k]=np.array(p); return k
 for y in range(h-1):
  for x in range(w-1):
   v=(a[y,x],a[y,x+1],a[y+1,x+1],a[y+1,x]); c=sum(1<<i for i,g in enumerate(v) if g<128)
   for e,f in cases.get(c,[]):
    k,j=edge(x,y,e,v),edge(x,y,f,v); graph.setdefault(k,[]).append(j); graph.setdefault(j,[]).append(k)
 used=set(); out=[]
 for first in graph:
  if first in used: continue
  cur=first; prev=None; path=[]
  while cur not in used:
   used.add(cur); path.append(coords[cur]); nn=graph[cur]; nxt=nn[0] if nn[0]!=prev else nn[-1]; prev,cur=cur,nxt
  if len(path)>7:
   p=np.array(path); area=abs(np.sum(p[:,0]*np.roll(p[:,1],-1)-p[:,1]*np.roll(p[:,0],-1)))/2
   if area>.7: out.append(p)
 return out
def rdp_indices(p,eps):
 if len(p)<3: return [0,len(p)-1]
 v=p[-1]-p[0]; n=np.linalg.norm(v)
 d=np.linalg.norm(p-p[0],axis=1) if n<1e-9 else np.abs(v[0]*(p[:,1]-p[0,1])-v[1]*(p[:,0]-p[0,0]))/n
 i=int(np.argmax(d))
 if d[i]>eps: return rdp_indices(p[:i+1],eps)[:-1]+[j+i for j in rdp_indices(p[i:],eps)]
 return [0,len(p)-1]
def norm(v):
 n=np.linalg.norm(v); return v/n if n>1e-12 else v
def bez(q,t):
 s=1-t; return s*s*s*q[0]+3*s*s*t*q[1]+3*s*t*t*q[2]+t*t*t*q[3]
def fit(p,left,right,error=.22,depth=0):
 if len(p)==2:
  d=np.linalg.norm(p[1]-p[0])/3
  return [np.array([p[0],p[0]+left*d,p[1]+right*d,p[1]])]
 u=np.r_[0,np.cumsum(np.linalg.norm(np.diff(p,axis=0),axis=1))]; u/=u[-1]
 s=1-u; b0=s**3; b1=3*s*s*u; b2=3*s*u*u; b3=u**3; a1=b1[:,None]*left; a2=b2[:,None]*right
 c=np.array([[np.sum(a1*a1),np.sum(a1*a2)],[np.sum(a1*a2),np.sum(a2*a2)]])
 tmp=p-(b0+b1)[:,None]*p[0]-(b2+b3)[:,None]*p[-1]; x=np.array([np.sum(a1*tmp),np.sum(a2*tmp)])
 try: alpha=np.linalg.solve(c,x)
 except np.linalg.LinAlgError: alpha=np.array([0.,0.])
 dist=np.linalg.norm(p[-1]-p[0])
 if min(alpha)<1e-6*dist or max(alpha)>dist: alpha=np.array([dist/3,dist/3])
 q=np.array([p[0],p[0]+alpha[0]*left,p[-1]+alpha[1]*right,p[-1]])
 ee=np.array([np.sum((bez(q,t)-pt)**2) for pt,t in zip(p,u)]); split=int(np.argmax(ee))
 if ee[split]<=error*error or depth>25: return [q]
 split=min(max(split,1),len(p)-2); tangent=norm(p[split-1]-p[split+1])
 return fit(p[:split+1],left,tangent,error,depth+1)+fit(p[split:],-tangent,right,error,depth+1)
def make_path(raw,origin):
 mid=int(np.argmax(np.linalg.norm(raw-raw[0],axis=1)))
 indices=rdp_indices(raw[:mid+1],.3)[:-1]+[i+mid for i in rdp_indices(np.vstack((raw[mid:],raw[:1])),.3)[:-1]]
 simple=raw[indices]; corners=[]; n=len(simple)
 for i in range(n):
  a=norm(simple[i]-simple[(i-1)%n]); b=norm(simple[(i+1)%n]-simple[i])
  if math.acos(float(np.clip(np.dot(a,b),-1,1)))>math.radians(38): corners.append(indices[i])
 if len(corners)<2: corners=[0,mid]
 p=raw-origin; count=len(p); curves=[]
 for j,start in enumerate(corners):
  end=corners[(j+1)%len(corners)]
  ii=list(range(start,end+1)) if end>start else list(range(start,count))+list(range(0,end+1))
  seg=p[ii]; curves+=fit(seg,norm(seg[1]-seg[0]),norm(seg[-2]-seg[-1]))
 def xy(v): return f'{v[0]:.3f} {v[1]:.3f}'
 return 'M '+xy(curves[0][0])+''.join(' C '+xy(q[1])+' '+xy(q[2])+' '+xy(q[3]) for q in curves)+' Z'
metadata={'sourcePixels':im.size,'status':'Provisional reconstruction from flat raster reference; original vector review required','assets':{}}
for name,box in [('odirico',(78,78,731,246)),('symbol',(388,388,489,490))]:
 crop=im.crop(box); cc=contours(crop); ap=np.vstack(cc); lo=ap.min(axis=0); hi=ap.max(axis=0); size=hi-lo+2
 d=' '.join(make_path(c,lo-1) for c in cc)
 for color,fill in [('black','#111111'),('white','#ffffff')]:
  svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size[0]:.3f} {size[1]:.3f}"><title>Odirico Holdings {name}</title><desc>Provisional reconstruction from supplied flat raster artwork. Original vector review pending.</desc><path fill="{fill}" fill-rule="evenodd" d="{d}"/></svg>\n'
  target=OUT/f'{name}-{color}.svg'; target.write_text(svg,encoding='utf-8'); print(target)
 metadata['assets'][name]={'crop':box,'artworkPixels':[float(x) for x in hi-lo],'contours':len(cc)}
(OUT/'branding-metadata.json').write_text(json.dumps(metadata,indent=2),encoding='utf-8')
