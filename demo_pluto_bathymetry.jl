### A Pluto.jl notebook ###
# v0.11.14

using Markdown
using InteractiveUtils

# This Pluto notebook uses @bind for interactivity. When running this notebook outside of Pluto, the following 'mock version' of @bind gives bound variables a default value (instead of an error).
macro bind(def, element)
    quote
        local el = $(esc(element))
        global $(esc(def)) = Core.applicable(Base.get, el) ? Base.get(el) : missing
        el
    end
end

# ╔═╡ a73297b8-ed15-11ea-0915-63edf6769bb1
begin 
	using Plots
	using PlutoUI
	using PyPlot
	using DIVAnd
end

# ╔═╡ 51c4cf54-ed23-11ea-3116-e3341d2f2190
md"""
## Set bathymetry parameters
### Bathymetry file
Indicate the path of the directory that stores the bathymetry:
"""

# ╔═╡ 385e2f9a-ed20-11ea-24d7-cd7a536c78df
@bind bathdir TextField()

# ╔═╡ 1710e054-ed24-11ea-30cb-03a941b3b1c3
md"""
Chose among the 3 available files:
"""

# ╔═╡ 53e5bd40-ed17-11ea-1135-036c66a58649
@bind bathfile Select(["gebco_30sec_16.nc", "gebco_30sec_8.nc", "gebco_30sec_4.nc"])

# ╔═╡ 75d3e690-ed24-11ea-2961-c7a76c2572d2
md"""
Check the box if the bathymetry is global
"""

# ╔═╡ 75166930-ed24-11ea-33bc-ab751079962b
@bind bathisglobal CheckBox()

# ╔═╡ 953e6faa-ed24-11ea-077d-7fbbbc4afe85
bathisglobal

# ╔═╡ 77af82a4-ed23-11ea-3424-9368c3f93d71
md"""
### Domain extension
Use the sliders to set the domain
"""

# ╔═╡ e2102e0e-ed21-11ea-3684-77dd737dd550
begin
	aaa = @bind lonmin Slider(20:1:30, default=27);	
	bbb = @bind lonmax Slider(40:1:45, default=42);
	ccc = @bind latmin Slider(35:1:45, default=40);
	ddd = @bind latmax Slider(45:1:55, default=47);
	
	md"""
	
	lonmin: $(aaa)
	lonmax: $(bbb)
	
	latmin: $(ccc)
	latmax: $(ddd)
	
	
	"""
end

# ╔═╡ e3d08c90-ed22-11ea-2b1c-ffbcc9af6c92
"lon min: $(lonmin), lon max: $(lonmax), lat min: $(latmin), lat max: $(latmax)"

# ╔═╡ a792096a-ed23-11ea-23de-bd35056d7a66
md"""
### Make the plot
"""

# ╔═╡ 3301da4c-f82e-11ea-18bb-adec63e6c73b
function with_pyplot(f::Function)
    f()
    fig = gcf()
    close(fig)
    return fig
end

# ╔═╡ 33785f66-f82c-11ea-13ca-53c5bf06589b
with_pyplot() do
    lonr = lonmin:0.2:lonmax;
	latr = latmin:0.2:latmax;
	bathname = joinpath(bathdir, bathfile);
	bx, by, b = extract_bath(bathname, bathisglobal, lonr, latr);
	llon, llat = ndgrid(bx, by);
	PyPlot.title("Domain bathymetry")
	PyPlot.pcolor(llon, llat, b)
end

# ╔═╡ 87420de6-ed27-11ea-098b-7f0afe067ec8
@info("Interpolation finished")

# ╔═╡ Cell order:
# ╠═a73297b8-ed15-11ea-0915-63edf6769bb1
# ╟─51c4cf54-ed23-11ea-3116-e3341d2f2190
# ╟─385e2f9a-ed20-11ea-24d7-cd7a536c78df
# ╟─1710e054-ed24-11ea-30cb-03a941b3b1c3
# ╟─53e5bd40-ed17-11ea-1135-036c66a58649
# ╟─75d3e690-ed24-11ea-2961-c7a76c2572d2
# ╟─75166930-ed24-11ea-33bc-ab751079962b
# ╠═953e6faa-ed24-11ea-077d-7fbbbc4afe85
# ╟─77af82a4-ed23-11ea-3424-9368c3f93d71
# ╟─e2102e0e-ed21-11ea-3684-77dd737dd550
# ╟─e3d08c90-ed22-11ea-2b1c-ffbcc9af6c92
# ╟─a792096a-ed23-11ea-23de-bd35056d7a66
# ╟─3301da4c-f82e-11ea-18bb-adec63e6c73b
# ╟─33785f66-f82c-11ea-13ca-53c5bf06589b
# ╠═87420de6-ed27-11ea-098b-7f0afe067ec8
