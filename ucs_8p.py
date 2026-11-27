BAN_DAU = (1, 2, 3, 4, 0, 6, 7, 5, 8)
DICH = (1, 2, 3, 4, 5, 6, 7, 8, 0)


CHI_PHI = {"U": 1, "D": 1, "L": 2, "R": 2}


def tim_o_trong(bang):
    for i in range(9):
        if bang[i] == 0:
            return i


def la_dich(bang):
    if bang == DICH:
        return True
    else:
        return False


def cac_huong_di(bang):
    vi_tri = tim_o_trong(bang)
    hang = vi_tri // 3
    cot = vi_tri % 3
    ds = []
    if hang > 0:
        ds.append("U")
    if hang < 2:
        ds.append("D")
    if cot > 0:
        ds.append("L")
    if cot < 2:
        ds.append("R")
    return ds


def di_chuyen(bang, huong):
    vi_tri = tim_o_trong(bang)
    if huong == "U":
        vi_tri_moi = vi_tri - 3
    elif huong == "D":
        vi_tri_moi = vi_tri + 3
    elif huong == "L":
        vi_tri_moi = vi_tri - 1
    else:
        vi_tri_moi = vi_tri + 1
    ds = list(bang)
    so_bi_doi = ds[vi_tri_moi]
    ds[vi_tri_moi] = 0
    ds[vi_tri] = so_bi_doi
    return tuple(ds)


def in_bang(bang):
    print(bang[0], bang[1], bang[2])
    print(bang[3], bang[4], bang[5])
    print(bang[6], bang[7], bang[8])
    print()


def tim_trong_frontier(bang, frontier):
    for i in range(len(frontier)):
        if frontier[i][0] == bang:
            return i
    return -1


def tim_re_nhat(frontier):
    vi_tri_re = 0
    for i in range(1, len(frontier)):
        if frontier[i][2] < frontier[vi_tri_re][2]:
            vi_tri_re = i
    return vi_tri_re


def ucs(bang_dau):

    frontier = [[bang_dau, [], 0]]
    explored = []

    while len(frontier) > 0:

        i = tim_re_nhat(frontier)
        phan_tu = frontier.pop(i)
        bang = phan_tu[0]
        duong_di = phan_tu[1]
        chi_phi = phan_tu[2]


        if la_dich(bang):
            return duong_di, chi_phi

        explored.append(bang)


        for huong in cac_huong_di(bang):
            bang_con = di_chuyen(bang, huong)

            chi_phi_con = chi_phi + CHI_PHI[huong]
            duong_con = duong_di + [huong]

            vi_tri = tim_trong_frontier(bang_con, frontier)
            if bang_con not in explored and vi_tri == -1:

                frontier.append([bang_con, duong_con, chi_phi_con])
            elif vi_tri != -1 and frontier[vi_tri][2] > chi_phi_con:

                frontier[vi_tri] = [bang_con, duong_con, chi_phi_con]


    return None, None


duong_di, tong_chi_phi = ucs(BAN_DAU)

if duong_di is None:
    print("Không tìm thấy lời giải")
else:
    print("Đường đi:", " -> ".join(duong_di))
    print("Số bước:", len(duong_di))
    print("Tổng chi phí:", tong_chi_phi)
    print()
    bang = BAN_DAU
    print("Ban đầu:")
    in_bang(bang)
    for huong in duong_di:
        bang = di_chuyen(bang, huong)
        print("Sau khi đi", huong, "(chi phí", CHI_PHI[huong], ")")
        in_bang(bang)
