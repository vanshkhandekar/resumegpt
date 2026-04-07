import os
import subprocess
import glob

def create_diagram(name, dot_content):
    os.makedirs('data/diagrams', exist_ok=True)
    dot_file = f"data/diagrams/{name}.dot"
    png_file = f"data/diagrams/{name}.png"
    
    with open(dot_file, 'w') as f:
        f.write(dot_content)
        
    subprocess.run(['dot', '-Tpng', dot_file, '-o', png_file, '-Gdpi=300'])
    print(f"Generated {png_file}")

# 1. System Flow Diagram for Admin
dot_sys_admin = """
digraph G {
    node [shape=box, style=rounded, fontname="Arial", margin="0.2,0.1"];
    edge [fontname="Arial"];
    
    Start [shape=oval];
    Login [label="Login"];
    Manage [label="Manage Templates"];
    ViewStats [label="View Platform Stats"];
    ManageUsers [label="Manage Users"];
    Stop [shape=oval];
    
    Start -> Login -> Manage -> ViewStats -> ManageUsers -> Stop;
}
"""

# 2. System Flow Diagram for User
dot_sys_user = """
digraph G {
    node [shape=box, style=rounded, fontname="Arial", margin="0.2,0.1"];
    edge [fontname="Arial"];
    
    Start [shape=oval];
    Register [label="Register"];
    Login [label="Login"];
    CheckLogin [shape=diamond, label="If login\nvalid?", margin="0,0"];
    Dashboard [label="Dashboard"];
    Builder [label="Open Resume Builder"];
    FillDetails [label="Fill Resume Details\n& Get AI Suggestions"];
    Download [label="Download PDF"];
    
    Start -> Register -> Login -> CheckLogin;
    CheckLogin -> Dashboard [label="Yes"];
    CheckLogin -> Register [label="No"];
    Dashboard -> Builder -> FillDetails -> Download;
}
"""

# 3. Activity Diagram for Admin
dot_act_admin = """
digraph G {
    node [shape=box, style=rounded, fontname="Arial"];
    Start [shape=circle, style=filled, color=black, width=0.2, label=""];
    End [shape=doublecircle, style=filled, color=black, width=0.2, label=""];
    
    Login [label="Login"];
    Sync [shape=rect, width=4, height=0.1, style=filled, color=black, label=""];
    Sync2 [shape=rect, width=4, height=0.1, style=filled, color=black, label=""];
    
    A [label="Manage Users"];
    B [label="Update Templates"];
    C [label="View Analytics"];
    
    Start -> Login -> Sync;
    Sync -> A;
    Sync -> B;
    Sync -> C;
    
    A -> Sync2;
    B -> Sync2;
    C -> Sync2;
    
    Sync2 -> End;
}
"""

# 4. Activity Diagram for User
dot_act_user = """
digraph G {
    node [shape=box, style=rounded, fontname="Arial"];
    Start [shape=circle, style=filled, color=black, width=0.2, label=""];
    End [shape=doublecircle, style=filled, color=black, width=0.2, label=""];
    
    Register [label="Register"];
    Login [label="Login"];
    Sync [shape=rect, width=4, height=0.1, style=filled, color=black, label=""];
    Sync2 [shape=rect, width=4, height=0.1, style=filled, color=black, label=""];
    Verify [shape=diamond, label="Verify\nLogin"];
    
    A [label="Create Resume"];
    B [label="ATS Score Check"];
    C [label="Download PDF"];
    
    Start -> Register -> Login -> Verify;
    Verify -> Login [label="No"];
    Verify -> Sync [label="Yes"];
    
    Sync -> A;
    Sync -> B;
    Sync -> C;
    
    A -> Sync2;
    B -> Sync2;
    C -> Sync2;
    
    Sync2 -> End;
}
"""

# 5. State Diagram of Admin
dot_state_admin = """
digraph G {
    node [shape=box, style=rounded, fontname="Arial"];
    Start [shape=circle, style=filled, color=black, width=0.2, label=""];
    End [shape=doublecircle, style=filled, color=black, width=0.2, label=""];
    
    Login [label="Login"];
    AddTemplates [label="Add or Update\\nTemplates"];
    ViewData [label="View User Data"];
    
    Start -> Login;
    Login -> AddTemplates [label="Update Templates"];
    Login -> ViewData [label="Analytics"];
    
    AddTemplates -> End [label="Logout"];
    ViewData -> End [label="Logout"];
    Login -> End [label="Logout"];
}
"""

# 6. State Diagram of User
dot_state_user = """
digraph G {
    node [shape=box, style=rounded, fontname="Arial"];
    Start [shape=circle, style=filled, color=black, width=0.2, label=""];
    End [shape=doublecircle, style=filled, color=black, width=0.2, label=""];
    
    Register [label="Register", shape=box];
    Login [label="Login", shape=box];
    Dashboard [label="Dashboard", shape=box];
    Builder [label="Edit Resume", shape=box];
    Score [label="Check ATS Score", shape=diamond];
    
    Start -> Register [label="Enter Details"];
    Register -> Login [label="Enter details to login"];
    Login -> Dashboard [label="Select Template"];
    Dashboard -> Builder;
    Builder -> Score;
    Score -> Builder [label="Score < 70"];
    Score -> End [label="Score > 70\\nDownload"];
}
"""

def generate_all_diagrams():
    create_diagram("system_flow_admin", dot_sys_admin)
    create_diagram("system_flow_user", dot_sys_user)
    create_diagram("activity_admin", dot_act_admin)
    create_diagram("activity_user", dot_act_user)
    create_diagram("state_admin", dot_state_admin)
    create_diagram("state_user", dot_state_user)

if __name__ == "__main__":
    generate_all_diagrams()
